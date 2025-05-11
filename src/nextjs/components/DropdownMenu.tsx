"use client"
import React, { useContext, } from 'react'
import { VideoContext } from '../context/videoContext';

const DropdownMenu = () => {
    const { highlightedText, currentVocabs, setCurrentVocabs } = useContext(VideoContext)

    const handleAddToBank = () => {
        {/* 
            Adds highlighted text to the current vocab bank
            Returns: void
        */}
        if (currentVocabs.length >= 10) {
            alert('You have reached the max amount allowed!');
            return;
        }
        if (!currentVocabs.includes(highlightedText)) {
            setCurrentVocabs([...currentVocabs, highlightedText]);
            localStorage.setItem("currentVocabs", JSON.stringify([...currentVocabs, highlightedText]))
        }
    }

    return (
        <div data-testid="DropdownMenuId">
            <div className="absolute z-10 w-28 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleAddToBank}
                    >
                        Add to Bank
                    </button>
                </div>
            </div>

        </div>
    )
}

export default DropdownMenu