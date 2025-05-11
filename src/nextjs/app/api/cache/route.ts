import { NextResponse, NextRequest } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import GlobalCache from '@/models/GlobalCache'

interface TranscriptItemType {
    text: string,
    start: number,
    duration: number
}

interface ResponseData {
    videoId: string,
    langCode: string,
    transcript: TranscriptItemType[],
    translation: string[],
    found: true
}

interface TranscriptEntry {
    langCode: string,
    transcript: TranscriptItemType[],
    translation: string[]
}

interface CachedVideo {
    videoId: string;
    transcriptData: TranscriptEntry[];
};


/*
    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
*/

export async function GET(req: NextRequest) {
    {/* 
        GET request to check if the video and language combination exists in the cache
        Parameters: video_id, lang
        video_id (string): videoId of youtube video url
        lang (string): language code of the video
        Returns:
            ResponseData {
                videoId: string,
                langCode: string,
                transcript: TranscriptItemType[],
                translation: string[],
                found: true
            }
    */}
    const params = req.nextUrl.searchParams;
    const videoId = params.get('video_id');
    const langCode = params.get('lang');

    if (!videoId || !langCode) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    try {
        await connectToMongoDB();

        const foundExistingData = await GlobalCache.findOne(
            {
                videoId: videoId,
                "transcriptData.langCode": langCode
            },
            { "transcriptData.$": 1 }
        );

        if (!foundExistingData || foundExistingData.transcriptData.length === 0) {
            return NextResponse.json({
                found: false,
                message: 'No cached data found for this video and language'
            }, { status: 200 });
        }

        // Extract the matched transcript data (we know it's the first element due to $ operator)
        const matchedData = foundExistingData.transcriptData[0];

        const responseData: ResponseData = {
            videoId: videoId,
            langCode: matchedData.langCode,
            transcript: matchedData.transcript,
            translation: matchedData.translation,
            found: true
        }

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('Error sending GET /api/cache: ', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    {/* 
        POST request to add new video and language combination to the cache
        Parameters: video_id, lang, transcript, translation
        video_id (string): videoId of youtube video url
        lang (string): language code of the video
        transcript (TranscriptItemType[]): transcript data
        Returns: 
            NextResponse.json({
                message: 'Cache updated successfully',
                videoId,
                langCode
            }, { status: 201 });

    */}
    try {
        const body = await req.json();
        const { videoId, langCode, transcript, translation } = body;

        if (!videoId || !langCode || !transcript || !translation) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        await connectToMongoDB();

        // Check if this video already exists in the cache
        const existingVideo: CachedVideo | null = await GlobalCache.findOne({ videoId });

        if (existingVideo) {
            // Check if this language already exists for this video
            const langExists = existingVideo.transcriptData.some(
                (data: TranscriptEntry) => data.langCode === langCode
            );

            if (langExists) {
                // Update existing language data
                await GlobalCache.findOneAndUpdate(
                    { videoId, "transcriptData.langCode": langCode },
                    {
                        $set: {
                            "transcriptData.$.transcript": transcript,
                            "transcriptData.$.translation": translation
                        }
                    }
                );
            } else {
                // Add new language data to existing video
                await GlobalCache.findOneAndUpdate(
                    { videoId },
                    {
                        $push: {
                            transcriptData: {
                                langCode,
                                transcript,
                                translation
                            }
                        }
                    }
                );
            }
        } else {
            // Create new video entry with this language
            await GlobalCache.create({
                videoId,
                transcriptData: [
                    {
                        langCode,
                        transcript,
                        translation
                    }
                ]
            });
        }

        return NextResponse.json({
            message: 'Cache updated successfully',
            videoId,
            langCode
        }, { status: 201 });

    } catch (error) {
        console.error('Error sending POST /api/cache: ', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}