import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';

interface JobStatus {
    id: string,
    state: string,
    result: {
        position: number,
        translations: string[]
    } | null
};

const redisConnection = {
    host: 'redis',
    port: 6379,
};

const translationQueue = new Queue('translation-tasks', {
    connection: redisConnection
});

export async function GET(request: Request) {
    try {
        // Extract JobId from request URL
        const url = new URL(request.url);
        const pathnameParts = url.pathname.split('/');
        const jobId = pathnameParts[pathnameParts.length - 1];

        if (!jobId) {
            return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
        }

        const jobs = await translationQueue.getJobs();

        // Get all jobs specific to JobId
        const batchJobs = jobs.filter(job => job.name.startsWith(`job-${jobId}`));

        if (batchJobs.length === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Create a new array of all jobs and its state in the batch
        const jobStates: JobStatus[] = await Promise.all(
            batchJobs.map(async job => {
                const state = await job.getState();
                const result = state === 'completed' ? job.returnvalue : null;
                return { id: job.id, state, result };
            })
        );

        const totalJobs = batchJobs.length;
        const completedJobs = jobStates.filter(job => job.state === 'completed').length;
        const failedJobs = jobStates.filter(job => job.state === 'failed').length;

        if (completedJobs === totalJobs) {
            const results = jobStates
                .filter((job): job is JobStatus & { result: NonNullable<JobStatus['result']> } => job.result !== null)
                .sort((a, b) => a.result.position - b.result.position); // ensures original order

            const translations = results.flatMap(job => job.result.translations || []);

            return NextResponse.json({
                status: 'complete',
                result: translations,
                progress: {
                    completed: completedJobs,
                    total: totalJobs,
                    percentage: 100
                }
            });
        } else if (failedJobs > 0) {
            return NextResponse.json({
                status: 'failed',
                error: 'One or more translation tasks failed',
                progress: {
                    completed: completedJobs,
                    failed: failedJobs,
                    total: totalJobs,
                    percentage: (completedJobs / totalJobs) * 100
                }
            });
        } else {
            return NextResponse.json({
                status: 'processing',
                progress: {
                    completed: completedJobs,
                    total: totalJobs,
                    percentage: (completedJobs / totalJobs) * 100
                }
            });
        }
    } catch (error) {
        console.error("Status check error:", error);
        return NextResponse.json({ error: 'Failed to check translation status' }, { status: 500 });
    }
}
