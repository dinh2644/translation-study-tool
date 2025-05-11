"use client"
import React, { useContext } from 'react'
import { VideoContext } from '../context/videoContext';
import VideoJS from './VideoJS';
import 'videojs-youtube';

const VideoPlayer = () => {
    const { playerRef, videoId, transcript, currentTranscriptItem, setCurrentTranscriptItem, activeIndex, setActiveIndex } = useContext(VideoContext)

    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        techOrder: ["youtube"],
        height: 100,
        width: 100,
        rel: 0,
        sources: [{
            src: `https://www.youtube.com/watch?v=${videoId}`,
            type: 'video/youtube'
        }],
        // the youtube configs below dont actually work (must fix)
        youtube: {
            rel: 0,               // Disable related videos
            iv_load_policy: 3,    // Hide annotations
            disablekb: 1,         // Disable keyboard controls
            controls: 0,          // Hide YouTube's native controls
        }
    };

    const handleSync = () => {
        {/* 
            Syncs the current transcript item with the current time
            Returns: void
        */}
        if (!playerRef.current) return;
        const player = playerRef.current;
        const currentTime = player.currentTime();

        // Only display transcipt item (sentence) when currentTime is in its time frame (SINGLE SENTENCE VIEW MODE)
        const visibleTranscriptItem = transcript.filter((transcriptItem, index) => {
            const nextSentenceStartTime = index < transcript.length - 1 ? transcript[index + 1].start : Infinity;
            return transcriptItem.start <= currentTime && currentTime < nextSentenceStartTime;
        })
        if (JSON.stringify(visibleTranscriptItem) !== JSON.stringify(currentTranscriptItem)) {
            setCurrentTranscriptItem(visibleTranscriptItem);
        }

        // Returns the current index of the current transcript item/sentence (FULL TRANSCRIPT VIEW MODE)
        const currentIndex = transcript.findIndex((transcriptItem, index) => {
            const nextSentenceStartTime = index < transcript.length - 1 ? transcript[index + 1].start : Infinity;
            return transcriptItem.start <= currentTime && currentTime < nextSentenceStartTime;
        });
        if (currentIndex !== -1 && currentIndex !== activeIndex) {
            setActiveIndex(currentIndex);
        }
    }

    const handlePlayerReady = (player: VideoJsPlayer) => {
        {/* 
            Sets the playerRef to the player
            Returns: void
        */}
        playerRef.current = player;

        player.on("timeupdate", () => {
            handleSync();
        })
    };

    return (
        <div className="h-[55vh] w-full shadow-sm border border-gray-300 overflow-hidden" data-testid="VideoPlayerId">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div >
    )
}

export default VideoPlayer