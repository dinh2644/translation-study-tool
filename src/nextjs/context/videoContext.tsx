"use client"
import { createContext, useState, ReactNode, useEffect, useRef, Dispatch, SetStateAction } from 'react';

/* 
    This context is to avoid pass passing props around components through Home.tsx
    All data & functions in here are shared and reused across multiple components
*/

interface ChildrenType {
    children: ReactNode;
}

interface TranscriptItemType {
    text: string,
    start: number,
    duration: number
}

interface VideoContextType {
    videoUrl: string,
    setVideoUrl: Dispatch<SetStateAction<string>>,
    transcript: TranscriptItemType[],
    fetchTranscript: (video_id: string, lang: string) => void,
    videoId: string,
    translatedTranscript: string[],
    finishedTranslating: boolean,
    currentTranscriptItem?: TranscriptItemType[],
    setCurrentTranscriptItem: Dispatch<SetStateAction<TranscriptItemType[]>>,
    activeIndex: number,
    setActiveIndex: Dispatch<SetStateAction<number>>,
    playerRef: React.RefObject<VideoJsPlayer | null>,
    highlightedText: string,
    setHighlightedText: Dispatch<SetStateAction<string>>,
    currentVocabs: string[],
    setCurrentVocabs: Dispatch<SetStateAction<string[]>>,
    translationProgress: number,
    setTranslationProgress: Dispatch<SetStateAction<number>>,
    sourceLang: string,

}

// These are basically global states, functions, etc. that can be used by any component without prop passing
const VideoContext = createContext<VideoContextType>({
    videoUrl: "",
    setVideoUrl: () => { },
    transcript: [],
    fetchTranscript: () => { },
    videoId: "",
    translatedTranscript: [],
    finishedTranslating: true,
    currentTranscriptItem: [],
    setCurrentTranscriptItem: () => { },
    activeIndex: 0,
    setActiveIndex: () => { },
    playerRef: { current: null },
    highlightedText: "",
    setHighlightedText: () => { },
    currentVocabs: [],
    setCurrentVocabs: () => { },
    translationProgress: 0,
    setTranslationProgress: () => { },
    sourceLang: "",
});

const VideoProvider = ({ children }: ChildrenType) => {
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [transcript, setTranscript] = useState<TranscriptItemType[]>([]);
    const [videoId, setVideoId] = useState<string>("");
    const [translatedTranscript, setTranslatedTranscript] = useState<string[]>([]);
    const [finishedTranslating, setFinishedTranslating] = useState<boolean>(true);
    const [currentTranscriptItem, setCurrentTranscriptItem] = useState<TranscriptItemType[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const playerRef = useRef<VideoJsPlayer | null>(null);
    const [highlightedText, setHighlightedText] = useState<string>("");
    const [currentVocabs, setCurrentVocabs] = useState<string[]>([]);
    const [translationProgress, setTranslationProgress] = useState<number>(0);
    const [sourceLang, setSourceLang] = useState<string>("");

    // States below will persist through page refresh

    useEffect(() => {
        const savedTranscript = localStorage.getItem("transcript");
        const savedVideoId = localStorage.getItem("videoId");
        const savedTranslatedTranscript = localStorage.getItem("translatedTranscript");
        const backupTranslation = localStorage.getItem("translatedTranscriptBackup");
        const savedCurrentVocabs = localStorage.getItem("currentVocabs");

        if (savedTranscript) setTranscript(JSON.parse(savedTranscript)); // parse back to TranscriptType[]
        if (savedVideoId) setVideoId(savedVideoId);
        if (savedCurrentVocabs) setCurrentVocabs(JSON.parse(savedCurrentVocabs));

        if (savedTranslatedTranscript) {
            setTranslatedTranscript(JSON.parse(savedTranslatedTranscript));
        }
        // Fallback incase user refresh page during translation process 
        else if (backupTranslation) {
            setTranslatedTranscript(JSON.parse(backupTranslation));
            localStorage.setItem("translatedTranscript", backupTranslation);
            localStorage.removeItem("translatedTranscriptBackup");
        }
    }, []);

    // Methods


    const checkCache = async (video_id: string, lang_code: string) => {
        {/* 
            Activated when clicking load video to check for cahced translation/transcripts by videoId in MongoDB
            Parameters: video_id, lang_code
            video_id (string): videoId of youtube video url
            lang_code (string): language code of the video
            Returns:
             ResponseData {
                videoId: string,
                langCode: string,
                transcript: TranscriptItemType[],
                translation: string[],
                found: true
            }
        */}

        const res = await fetch(`/api/cache?video_id=${video_id}&lang=${lang_code}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error);
        }

        const data = await res.json();

        if (!data.found) {
            return null;
        }

        return data;
    }

    const fetchTranscript = async (video_id: string, sourceLang: string) => {
        {/* 
            First checks the cache before fetching FastAPI api route to get transcript & send it to translation API
            video_id (string): videoId of youtube video url
            sourceLang (string): language code of the video
            Returns: void
        */}
        try {
            const cacheResult = await checkCache(video_id, sourceLang);

            if (cacheResult) {
                handleTranscriptSuccess(cacheResult.transcript, video_id, sourceLang);
                setSourceLang(sourceLang);
                setTranslatedTranscript(cacheResult.translation);
                setFinishedTranslating(true);

                const translatedTexts = JSON.stringify(cacheResult.translation);
                localStorage.setItem("translatedTranscript", translatedTexts);

                if (translatedTexts) {
                    window.location.reload();
                }
                return;
            }

            // Otherwise fetch normally
            const transcriptData: TranscriptItemType[] | null = await handleGetTranscriptFromAPI(video_id, sourceLang);
            if (!Array.isArray(transcriptData) || transcriptData.length === 0 || !transcriptData) {
                alert("Couldn't fetch subtitles. Please check the video and try again.");
                return;
            }

            handleTranscriptSuccess(transcriptData, video_id, sourceLang);
            fetchTranslatedTranscript(transcriptData, sourceLang);

        } catch (error) {
            console.error("Error calling fetchTranscript: ", error);
            throw new Error("Error calling fetchTranscript", { cause: error });
        }
    }

    const handleGetTranscriptFromAPI = async (video_id: string, sourceLang: string) => {
        {/* 
            Fetches transcript from FastAPI api route
            video_id (string): videoId of youtube video url
            sourceLang (string): language code of the video
            Returns:
            ResponseData = {
                text: string,
                start: number,
                duration: number
            }
            
        */}
        try {
            const res = await fetch(`/api/transcript/?video_id=${video_id}&lang=${sourceLang}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            };

            const transcriptData = await res.json();

            if (transcriptData.status === 500) {
                alert('Error fetching transcript. Try again!');
                return null;
            }

            return transcriptData;
        } catch (error) {
            console.error("Error calling get_transcript: ", error);
            throw new Error("Error calling get_transcript", { cause: error });
        }
    }

    const handleTranscriptSuccess = (transcriptData: TranscriptItemType[], video_id: string, sourceLang: string) => {
        {/* 
            Handles transcript success
            transcriptData (TranscriptItemType[]): transcript data
            video_id (string): videoId of youtube video url
            sourceLang (string): language code of the video
            Returns: void
        */}
        // Reset old translations (if any)
        localStorage.setItem('translatedTranscript', '');
        setTranslatedTranscript([]);
        setFinishedTranslating(false);

        // Set new values
        localStorage.setItem("transcript", JSON.stringify(transcriptData));
        localStorage.setItem("videoId", video_id);
        setTranscript(transcriptData);
        setVideoId(video_id);
        setSourceLang(sourceLang);
    }

    const fetchTranslatedTranscript = async (transcript: TranscriptItemType[], sourceLang: string) => {
        {/* 
            Fetches translated transcript from translation API
            transcript (TranscriptItemType[]): transcript data
            sourceLang (string): language code of the video
            Returns: void
        */}
        try {
            setFinishedTranslating(false);
            setTranslationProgress(0);
            const textsToTranslate = transcript.map(t => t.text);

            // Step 1: Submit the translation job to our API route
            const submitResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: textsToTranslate,
                    targetLanguage: "en",
                    sourceLang
                })
            });

            if (!submitResponse.ok) {
                throw new Error('Error sending POST /api/translate (videoContext.tsx)');
            }

            const { jobId } = await submitResponse.json();

            // Step 2: Poll for results until translation is complete
            const pollInterval = 2000;

            const checkStatus = async () => {
                const statusResponse = await fetch(`/api/translate/${jobId}`);

                if (!statusResponse.ok) {
                    throw new Error('Error sending GET /api/translate/jobId (videoContext.tsx)');
                }

                const data = await statusResponse.json();

                if (data.status === 'complete') {
                    // Translation is complete
                    setTranslatedTranscript(data.result);

                    // Save to localStorage
                    const translatedTexts = JSON.stringify(data.result);
                    localStorage.setItem("translatedTranscript", translatedTexts);
                    setFinishedTranslating(true);

                    // Cache new result
                    try {
                        const videoId = localStorage.getItem("videoId");

                        await fetch('/api/cache', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                videoId: videoId,
                                langCode: sourceLang,
                                transcript: transcript,
                                translation: data.result
                            })
                        });
                        console.log('Successfully cached transcript and translation');
                    } catch (error) {
                        console.error('Failed to cache results:', error);
                    }
                    return true;

                } else if (data.status === 'processing') {
                    // Update progress
                    setTranslationProgress(data.progress.percentage);
                    console.log('translation process:', translationProgress);
                    return false;
                } else {
                    throw new Error('Unknown status');
                }
            };

            // Start polling
            const poll = async () => {
                try {
                    const isDone = await checkStatus();
                    if (!isDone) {
                        setTimeout(poll, pollInterval);
                    }
                } catch (error) {
                    console.error('Error polling for translation status:', error);
                    setFinishedTranslating(true);
                }
            };

            poll();
        } catch (error) {
            setFinishedTranslating(true);
            console.error('Error calling fetchTranslatedTranscript:', error);
            throw new Error("Error calling fetchTranslatedTranscript", { cause: error })
        }
    };

    return (
        <VideoContext.Provider value={
            {
                videoUrl,
                setVideoUrl,
                transcript,
                fetchTranscript,
                videoId,
                translatedTranscript,
                finishedTranslating,
                currentTranscriptItem,
                setCurrentTranscriptItem,
                activeIndex, setActiveIndex,
                playerRef, highlightedText,
                setHighlightedText,
                currentVocabs,
                setCurrentVocabs,
                translationProgress,
                setTranslationProgress,
                sourceLang,
            }}>
            {children}
        </VideoContext.Provider>
    );
};

export { VideoProvider, VideoContext };
