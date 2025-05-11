'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

interface Flashcard {
    front: string;
    back: string;
}

interface Deck {
    _id: string,
    postedBy: string,
    deckName: string,
    createdAt: string,
    videoUrl: string,
    flashcards: Flashcard[],
}

export default function DeckPage() {
    const [deck, setDeck] = useState<Deck | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;


    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const res = await fetch(`/api/flashcard?id=${id}`);

                if (!res.ok) {
                    if (res.status === 404) {
                        router.push('/404');
                        return;
                    }
                    if (res.status === 401) {
                        router.push('/decks');
                        return;
                    }
                    throw new Error('Failed to fetch deck');
                }

                const data = await res.json();
                setDeck(data);
            } catch (err) {
                setError('Error loading deck');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, [params.id, router]);

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (error || !deck) {
        return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className='flex'>
                <h1 className="text-3xl font-bold mb-6">{deck.deckName}</h1>
                <a
                    href={deck.videoUrl}
                    title={deck.videoUrl}
                    className='text-red-500 px-2'
                    target="_blank"
                >
                    <Image
                        src="/images/youtube.png"
                        alt="youtube"
                        width={30}
                        height={30}
                        className='cursor-pointer'
                        title={deck.videoUrl}
                    />
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deck.flashcards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Front:</h3>
                            <p className="text-gray-700">{card.front}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Back:</h3>
                            <p className="text-gray-700">{card.back}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 