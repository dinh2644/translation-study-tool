import { NextResponse, NextRequest } from 'next/server';
import { Queue, Worker } from 'bullmq';
import { Translator } from 'arml';

// Initialize translator
const translator = new Translator(process.env.NEXT_PUBLIC_ARML_KEY!);

// Redis connection config
const redisConnection = {
    host: 'redis',
    port: 6379,
};

// Create queue (only on server)
const translationQueue = new Queue('translation-tasks', {
    connection: redisConnection,
});

// Create worker (server-side only)
const worker = new Worker('translation-tasks', async (job) => {
    const { chunk, position, targetLanguage, sourceLang } = job.data;

    try {
        const response = await translator.batchTranslate(chunk, {
            source: sourceLang,
            target: targetLanguage
        });

        return {
            position,
            translations: response?.translations.map((t: { translated_text: string }) => t.translated_text)
        };
    } catch (error) {
        console.error("Translation error:", error);
        throw error;
    }
}, { connection: redisConnection, concurrency: 100 });

// Handle worker events
worker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
});

export async function POST(request: NextRequest) {
    {/* 
        POST request to translate a transcript
        Returns:
        NextResponse.json({
            jobId,
            totalChunks: chunks.length,
            message: 'Translation job submitted'
        });
    */}
    try {
        const { transcript, targetLanguage, sourceLang } = await request.json();

        // Generate a unique job ID
        const jobId = Date.now().toString();

        // Split transcript into chunks
        const chunks = [];
        for (let i = 0; i < transcript.length; i += 10) {
            chunks.push(transcript.slice(i, i + 10));
        }

        // Add all chunks to the queue
        const jobs = [];
        for (let i = 0; i < chunks.length; i++) {
            jobs.push(
                translationQueue.add(`job-${jobId}-${i}`, {
                    chunk: chunks[i],
                    position: i,
                    targetLanguage,
                    sourceLang,
                    jobId
                })
            );
        }

        return NextResponse.json({
            jobId,
            totalChunks: chunks.length,
            message: 'Translation job submitted'
        });
    } catch (error) {
        console.error("Error fetching POST /api/translate:", error);
        return NextResponse.json({ error: 'Internal server error', status: 500 })
    }
}

