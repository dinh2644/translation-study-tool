import { NextRequest, NextResponse } from 'next/server'

type ResponseData = {
    text: string,
    start: number,
    duration: number
}

/*
    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
*/

export async function GET(req: NextRequest) {
    {/* 
        GET request to fetch transcript by video_id and lang
        Returns:
        NextResponse.json(data, { status: 200 });
    */}
    try {
        const params = req.nextUrl.searchParams;
        const video_id = params.get('video_id');
        const lang = params.get('lang');

        const res = await fetch(`http://fastapi:8000/get_transcript/?video_id=${video_id}&lang=${lang}`);

        if (!res.ok) return NextResponse.json({ error: '/get_transcript', status: 500 });

        const data: ResponseData = await res.json();

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error fetching GET /api/get_transcript: ', error);
        return NextResponse.json({ error: 'Internal server error', status: 500 })

    }
}