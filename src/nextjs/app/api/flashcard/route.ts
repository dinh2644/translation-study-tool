import { NextResponse, NextRequest } from 'next/server'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from 'zod';
import { connectToMongoDB } from '@/lib/mongodb';
import Deck from "@/models/Deck";
import { auth0 } from '@/lib/auth0';
import mongoose from 'mongoose';

/*
    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
*/

const Flashcard = z.object({
    front: z.string().describe("The front side of the flashcard that has the non-english text"),
    back: z.string().describe("The back side of the flashcard that has the english translation of the front side"),
}).describe('Flashcard to show user');

const FlashcardArray = z.array(Flashcard).describe("An array of flashcards for the user");

export async function POST(req: NextRequest) {
    {/* 
        POST request to create flashcards from a list of words
        Returns:
        NextResponse.json(flashcardResult, { status: 200 });
    */}
    try {
        const { language_code, words } = await req.json();

        if (!words || !Array.isArray(words) || words.length === 0) {
            return NextResponse.json({ error: 'No words provided' }, { status: 400 });
        }

        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            temperature: 0,
            maxRetries: 2,
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const structuredLlm = llm.withStructuredOutput(FlashcardArray, { name: "FlashcardArray" });

        // Create a prompt that includes all words
        const prompt = `Given this language code: ${language_code}. Create flashcards for these words: ${words.join(', ')}. Each flashcard should have the word in the target language on the front and its English translation on the back.`;

        const flashcardResult = await structuredLlm.invoke(prompt);
        console.log(flashcardResult);

        return NextResponse.json(flashcardResult, { status: 200 });

    } catch (error) {
        console.error('Error in /api/create_flashcard_ai: ', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    {/* 
        GET request to fetch all flashcards by user
        Returns:
        NextResponse.json(flashcards, { status: 200 });
    */}
    try {
        await connectToMongoDB();

        const session = await auth0.getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get the deck ID from URL params
        const params = req.nextUrl.searchParams;
        const id = params.get('id');

        if (!id) {
            return NextResponse.json({ error: "Missing deck ID" }, { status: 400 });
        }

        // Check if id is a valid Mongo ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid deck ID" }, { status: 404 });
        }

        const deck = await Deck.findById(id);

        if (!deck) {
            return NextResponse.json({ error: "Deck not found" }, { status: 404 });
        }

        // Check if user owns this deck
        if (deck.postedBy !== userId) {
            return NextResponse.json({ error: "Not authorized to view this deck" }, { status: 401 });
        }

        return NextResponse.json(deck);
    } catch (error) {
        console.error('Error fetching deck:', error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}