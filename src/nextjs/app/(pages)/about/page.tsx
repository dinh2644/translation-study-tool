import React from 'react';

const AboutPage = () => {

    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-12">
            <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-2xl w-full text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">About LiveLingo</h1>
                <p className="text-lg text-gray-700 mb-6">
                    LiveLingo is a translation tool designed to help you understand YouTube videos that have may have non-English transcripts but no English subtitles.
                </p>
                <p className="text-md text-gray-700 mb-4">
                    In version 1, LiveLingo works exclusively with YouTube videos by pulling available transcripts and translating them into English — giving you access to global content that would otherwise be hard to follow.
                </p>
                <p className="text-md text-gray-700 mb-4">
                    As the app evolves, LiveLingo will support more media types beyond YouTube. We&apos;re working toward features like AI-powered speech-to-text, allowing us to generate transcripts even when none exist, and deliver smarter, context-aware translations.
                </p>
                <p className="text-md text-gray-500 mt-6 italic">
                    This is just the beginning — we&apos;re building an app where language is no longer a barrier to understanding online videos.
                </p>
                😊
            </div>
        </div>
    );
};

export default AboutPage;
