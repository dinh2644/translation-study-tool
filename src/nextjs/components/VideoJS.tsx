"use client"
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// source: https://videojs.com/guides/react/

type VideoJSProps = {
    options: VideoJSOptions;
    onReady?: (player: VideoJsPlayer) => void;
};

const VideoJS = (props: VideoJSProps) => {
    const videoRef = React.useRef<HTMLDivElement>(null);
    const playerRef = React.useRef<VideoJsPlayer | null>(null);
    const { options, onReady } = props;

    React.useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current && videoRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');
            videoElement.style.height = '100%';
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                if (onReady) {
                    onReady(player);
                }
            });

            player.fill(true);
        } else if (playerRef.current) {
            const player = playerRef.current;
            player.autoplay(options.autoplay || false);
            player.src(options.sources);
        }
    }, [options, videoRef, onReady]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;
        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player style={{ height: '100%' }} data-testid="videojs-container">
            <div ref={videoRef} style={{ height: '100%' }} data-testid="videojs-video-ref" />
        </div>
    );
}

export default VideoJS;