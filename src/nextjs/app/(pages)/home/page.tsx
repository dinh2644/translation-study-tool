"use client"
import React, { useContext } from 'react'
import 'videojs-youtube';
import { VideoContext } from '@/context/videoContext';
import InputBar from "@/components/InputBar";
import VideoPlayer from '@/components/VideoPlayer';
import TranslationBox from '@/components/TranslationBox';
import VocabBank from '@/components/VocabBank';
import Navbar from '@/components/Navbar';

export default function HomePage() {
    const { videoId } = useContext(VideoContext);

    return (
        <>
            <div>
                <Navbar />
                <div className="flex justify-center items-center mt-2 mb-2">
                    <InputBar />
                </div>

                {videoId ? (
                    <div className="flex flex-col">
                        {/* Side-by-side layout */}
                        <div className="flex flex-col md:flex-row mx-20">
                            <div className="flex-1">
                                <VideoPlayer />
                            </div>
                            <div className="flex-1">
                                <TranslationBox />
                                <div className="text-black text-xs text-center opacity-90">
                                    Note: If translations didn&apos;t change, load target video again since translation process might&apos;ve been interrupted.
                                </div>
                            </div>
                        </div>
                        <VocabBank />
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-screen italic">
                        <div className="text-3xl font-light tracking-wide text-gray-700 -mt-36">Paste A Video URL to Get Started!</div>
                    </div>

                )}
            </div>
            {/* <footer className="fixed bottom-0 left-0 w-full text-center py-2 bg-white shadow-md z-50">
                <p className="text-xs">&copy; 2025 LiveLingo. All rights reserved.</p>
            </footer> */}
        </>

    )
}