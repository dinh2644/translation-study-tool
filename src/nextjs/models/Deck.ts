import mongoose from "mongoose"
//const { ObjectId } = mongoose.Schema.Types;

const flashcardSchema = new mongoose.Schema({
    front: String,
    back: String,
});

const deckSchema = new mongoose.Schema({
    postedBy: {
        type: String,
        required: true
    },
    deckName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    flashcards: [flashcardSchema]
});

const Deck = mongoose.models.decks || mongoose.model("decks", deckSchema);
export default Deck;