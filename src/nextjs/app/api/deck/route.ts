import { NextResponse, NextRequest } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import { auth0 } from "@/lib/auth0"
import Deck from "@/models/Deck"
/*
    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
*/

export async function GET() {
    {/* 
        GET request to fetch all decks by user
        Returns:
        NextResponse.json(decks, { status: 200 });
    */}
    try {
        await connectToMongoDB();

        const session = await auth0.getSession();
        const postedBy = session?.user.sub;

        const decks = await Deck.find({ postedBy }).sort({ createdAt: -1 });

        return NextResponse.json(decks, { status: 200 });
    } catch (error) {
        console.error('Error sending GET /api/decks: ', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    {/* 
        POST request to create a new deck
        Returns:
        NextResponse.json(newDeck, { status: 200 });
    */}
    try {
        await connectToMongoDB();

        const reqBody = await req.json();
        const { deckName, postedBy } = reqBody;

        // Check if deck name exists already under a user
        const deckNameExists = await Deck.findOne({ deckName: deckName, postedBy: postedBy });
        if (deckNameExists) return NextResponse.json({ error: 'Deck name exists already', status: 400 });

        console.log('userId', reqBody.postedBy);

        const newDeck = await Deck.create(reqBody);

        return NextResponse.json(newDeck, { status: 200 });

    } catch (error) {
        console.error('Error sending POST /api/deck: ', error);
        return NextResponse.json({ error: 'Internal server error', status: 500 })

    }
}
