'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react'

interface Deck {
    _id: string;
    deckName: string;
    createdAt: string;
    flashcards: {
        front: string;
        back: string;
    }[];
}

export default function DecksPage() {
    const [decks, setDecks] = useState<Deck[]>([]);


    useEffect(() => {
        const fetchDecks = async () => {
            const res = await fetch(`/api/deck`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            });

            if (!res.ok) {
                throw new Error('Error sending GET /api/decks (decks/page.tsx)');
            }

            const data = await res.json();
            setDecks(data);
        }
        fetchDecks();
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Decks</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decks && decks.length > 0 ? decks.map((deck: Deck) => (
                    <Link
                        href={`/decks/${deck._id}`}
                        key={deck._id}
                        className="block"
                    >
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold mb-2">{deck.deckName}</h2>
                            <p className="text-gray-600 mb-2">
                                {deck.flashcards.length} cards
                            </p>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(deck.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </Link>
                )) : (
                    <div className='text-xl font-light tracking-wide text-gray-700'>You Have No Flashcard Decks!</div>
                )}
            </div>
        </div >
    );

}