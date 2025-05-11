"use client"
import React, { ChangeEvent, useEffect, useState, useContext } from "react";
import { VideoContext } from "../context/videoContext";

type LanguagesListData = {
    languages: string[],
    video_id: string,
    error?: string,
    status?: number
}

const InputBar = () => {
    const { fetchTranscript, videoUrl, setVideoUrl } = useContext(VideoContext);
    const [videoId, setVideoId] = useState<string>("");
    const [foundVideo, setFoundVideo] = useState<boolean>(false);
    const [selectedLang, setSelectedLang] = useState<string>("");
    const [listOfLanguages, setListOfLanguages] = useState<LanguagesListData>({
        languages: [],
        video_id: ""
    });

    useEffect(() => {
        {/* 
            Loads saved video url, id, and selected language from local storage
            Returns: void
        */}
        const savedVideoUrl = localStorage.getItem("videoUrl");
        const savedVideoId = localStorage.getItem("videoId");
        const savedSelectedLang = localStorage.getItem("selectedLang");

        if (savedVideoUrl) setVideoUrl(savedVideoUrl);
        if (savedVideoId) setVideoId(savedVideoId);
        if (savedSelectedLang) setSelectedLang(savedSelectedLang);
    }, [setVideoUrl]);

    useEffect(() => {
        {/* 
            Resets video url, id, and selected language in local storage
            Returns: void
        */}
        const handleReset = () => {
            localStorage.setItem("videoUrl", videoUrl);
            localStorage.setItem("selectedLang", "");
            setSelectedLang("");
            setFoundVideo(false);
        };

        handleReset();

        const extractedVideoId = () => {
            {/* 
                Extracts video id from video url
                Returns: string
            */}
            const canonicalUrl = videoUrl.match(/v=[^&]+/);
            const shareableUrl = videoUrl.match(/.be\/[^?]+/);
            if (canonicalUrl) {
                return canonicalUrl[0].substring(2).trim();
            }
            else if (shareableUrl) {
                return shareableUrl[0].substring(4).trim();
            }
            else {
                return "";
            }
        }

        if (videoUrl.trim().length < 43) {
            setFoundVideo(false);
            return;
        }

        const id = extractedVideoId();

        const handleFetchLanguages = async (id: string) => {
            {/* 
                Fetches languages from FastAPI api route
                id (string): videoId of youtube video url
                Returns: void
            */}
            try {
                const res = await fetch(`/api/languages/?video_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Error sending GET /api/languages (InputBar.tsx)');
                };

                const data = await res.json();

                if (data.status === 500) {
                    alert('No valid video id found. Try again!');
                    return;
                }

                setVideoId(id);
                setFoundVideo(true);
                setListOfLanguages(data);

            } catch (error) {
                setVideoUrl("");
                console.error(error);
            }
        }

        handleFetchLanguages(id);
    }, [videoUrl, setVideoUrl]);

    useEffect(() => {
        {/* 
            Saves selected language to local storage
            Returns: void
        */}
        localStorage.setItem("selectedLang", selectedLang);
    }, [selectedLang]);

    const handleLoadVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
        {/* 
            Loads video and selected language
            Returns: void
        */}
        e.preventDefault();

        if (selectedLang === "") {
            alert("Must select a language");
            return;
        }

        // Backup current translations (in case user cancels translation process)
        const currentTranslation = localStorage.getItem("translatedTranscript");
        if (currentTranslation) {
            localStorage.setItem("translatedTranscriptBackup", currentTranslation);
        }

        fetchTranscript(videoId, selectedLang);
    }



    return (
        <div className="flex flex-row items-center gap-2" data-testid="InputBarId">
            {/* URL Input and Load Video Button */}
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-700">Paste YouTube URL:</h3>
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
                    className="w-60 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.youtube.com/"
                    maxLength={43}
                />

            </div>

            {/* Language Selector (only shown when video is found) */}
            {foundVideo && (
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700">Language:</h3>
                    <select
                        id="language"
                        value={selectedLang === "" ? "" : selectedLang}
                        name="language"
                        className="w-60 px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedLang(e.target.value)}
                    >
                        <option key={0} value="">--SELECT LANGUAGE--</option>
                        {listOfLanguages.languages && listOfLanguages.languages.map((item, id) => (
                            <option key={id + 1} value={item}>{item}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleLoadVideo}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Load Video
                    </button>
                </div>
            )}
        </div>


    )
}

export default InputBar