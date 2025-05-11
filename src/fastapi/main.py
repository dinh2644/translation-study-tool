from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_transcript")
async def get_transcript(video_id: str, lang: str):
    """
        GET request to fetch transcript by video_id and lang
        video_id (string): videoId of youtube video url
        lang (string): language code of the video
        Returns:
            {
                'transcript': string[],
                'video_id': str,
                'lang': str
            }
    """
    return YouTubeTranscriptApi.get_transcript(video_id, languages=[lang])

@app.get("/get_languages")
async def get_languages(video_id: str):
    """
        GET request to fetch languages by video_id
        video_id (string): videoId of youtube video url
        Returns:
            {
                'languages': string[],
                'video_id': str
            }
    """
    transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
    combinedTranscripts = list(transcripts._manually_created_transcripts.keys()) 
    combinedTranscripts.extend(transcripts._generated_transcripts.keys())
    
    lang_list_dict = {'languages' : [], 'video_id': video_id}

    for lang in combinedTranscripts:
        if lang not in lang_list_dict['languages']:
            lang_list_dict['languages'].append(lang)
    
    return lang_list_dict