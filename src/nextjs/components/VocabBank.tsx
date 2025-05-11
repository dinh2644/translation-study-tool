"use client"

import React, { useContext, useState } from 'react'
import { VideoContext } from '../context/videoContext';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';


const VocabBank = () => {
    const { currentVocabs, setCurrentVocabs, sourceLang, videoUrl } = useContext(VideoContext);
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deckName, setDeckName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();

    const handleRemoveVocab = (word: string) => {
        {/* 
            Removes a word from the current vocab bank
            word (string): word to remove
            Returns: void
        */}
        setCurrentVocabs(prev => {
            const updated = prev.filter(w => w !== word);
            localStorage.setItem("currentVocabs", JSON.stringify(updated));
            return updated;
        });
    }

    const handleCreateDeck = async () => {
        {/* 
            Creates a new deck with the current vocab bank
            Returns: void
        */}
        if (!deckName.trim() || currentVocabs.length === 0) return;

        setIsLoading(true);
        try {
            // 1. Create flashcards using AI
            const flashcardResponse = await fetch('/api/flashcard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language_code: sourceLang,
                    words: currentVocabs
                }),
            });

            if (!flashcardResponse.ok) {
                throw new Error('Error sending POST /api/flashcard (VocabBank.tsx)');
            }

            const flashcards = await flashcardResponse.json();

            // 2. Create the deck with the generated flashcards
            const deckResponse = await fetch('/api/deck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postedBy: user?.sub,
                    deckName: deckName,
                    createdAt: new Date().toISOString(),
                    videoUrl: videoUrl,
                    flashcards: flashcards
                }),
            });

            if (!deckResponse.ok) {
                throw new Error('Error sending POST /api/deck (VocabBank.tsx)');
            }

            // Reset state and redirect to flashcards page
            setCurrentVocabs([]);
            setDeckName("");
            setIsCreateOpen(false);
            router.push('/decks');
        } catch (error) {
            console.error('Error creating deck:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div data-testid="VocabBankId">
            <div className=" bg-white shadow-md max-h-64 p-4 mx-20 overflow-y-scroll">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Vocabulary Bank</h2>
                    <div className="flex gap-2">
                        <button
                            className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md transition-colors
                                ${currentVocabs.length === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                            onClick={() => setIsCreateOpen(true)}
                            disabled={currentVocabs.length === 0}
                        >
                            Create Flashcard Deck
                        </button>
                    </div>
                </div>
                <div className="overflow-auto h-full">
                    <div className="flex flex-wrap gap-2">
                        {currentVocabs.map((item, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {item}
                                <div
                                    className="ml-2 h-5 w-5 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 cursor-pointer text-xs font-bold transition"
                                    onClick={() => handleRemoveVocab(item)}
                                >
                                    ×
                                </div>
                            </span>
                        ))}
                        {currentVocabs.length === 0 && (
                            <p className="text-sm text-gray-500">
                                Highlight any non-translated text to add to your vocabulary bank
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {isCreateOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-[425px]">
                        <h2 className="text-xl font-semibold mb-4">Create Flashcard Deck</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="deckName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Deck Name
                                </label>
                                <input
                                    id="deckName"
                                    type="text"
                                    value={deckName}
                                    onChange={(e) => setDeckName(e.target.value)}
                                    placeholder="Enter deck name..."
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                This will create a new deck with {currentVocabs.length} flashcards from your vocabulary bank.
                            </p>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateDeck}
                                    disabled={!deckName.trim() || isLoading}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors
                                        ${(!deckName.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                                >
                                    {isLoading ? 'Creating...' : 'Create Deck'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VocabBank