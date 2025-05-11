"use client"
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { VideoContext } from '../context/videoContext';
import style from "./LoadingIndicator.module.css";
import DropdownMenu from './DropdownMenu';
import PlayTooltip from './PlayTooltip';

const TranslationBox = () => {
    const { playerRef, transcript, activeIndex, finishedTranslating, translatedTranscript, setHighlightedText, translationProgress } = useContext(VideoContext)
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const currentTranscriptItemRef = useRef<HTMLDivElement>(null);

    // Scroll autoamitcally to the current spoken sentence
    useEffect(() => {
        {/* 
            Scrolls to the current spoken sentence
            Returns: void
        */}
        if (currentTranscriptItemRef.current) {
            currentTranscriptItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [activeIndex]);

    const handleMouseUp = useCallback(() => {
        {/* 
            Opens dropdown menu when mouse is released
            Returns: void
        */}
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
            });
            setHighlightedText(selection.toString().trim());
            setIsOpen(true);
        }
    }, [setHighlightedText]);

    useEffect(() => {
        {/* 
            Closes dropdown menu when clicking outside
            Returns: void
        */}
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])

    const formatTimestamp = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return (
        <div className='h-[55vh] overflow-y-scroll shadow-sm border border-gray-300' style={{ backgroundColor: 'white' }} data-testid="TranslationBoxId" ref={dropdownRef}>
            {finishedTranslating ? (
                translatedTranscript.length > 0 && transcript.length > 0 && transcript.map((item, index) => (
                    <div
                        ref={index === activeIndex ? currentTranscriptItemRef : null}
                        key={index}
                        className={`px-1 py-1 transition-all duration-150 flex ${index === activeIndex
                            ? 'text-xl font-medium text-black'
                            : 'text-base text-gray-400'}`}
                    >
                        <div className="flex items-center space-x-2 ">
                            <PlayTooltip
                                src="/images/play-button.png"
                                alt="Play"
                                tooltip={`${formatTimestamp(item.start)} - ${formatTimestamp(item.start + item.duration)}`}
                                onClick={() => playerRef.current?.currentTime(item.start)}
                            />
                            <div>
                                {/* Original Text */}
                                <div onMouseUp={handleMouseUp}>{item.text}</div>
                                {/* Translated Text */}
                                <div className="text-red-500">{translatedTranscript[index]}</div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className='flex justify-center items-center h-full text-center'>
                    <div className={style.loadingindicator}>
                        <div className='flex flex-row items-center gap-4'>
                            <div className={style.spinner}></div>
                            {translationProgress > 65 ?
                                <p className='text-base text-gray-700'>Almost done...</p>
                                :
                                <p className='text-base text-gray-700'>Translating, please be patient...</p>
                            }
                            <p>{translationProgress}%</p>
                        </div>
                    </div>
                </div>

            )}
            {isOpen && <div style={{
                position: 'absolute',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`
            }}> <DropdownMenu /></div>}

        </div>
    )
}

export default TranslationBox