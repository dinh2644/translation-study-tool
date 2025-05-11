import mongoose from "mongoose"

const TranscriptItemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    start: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
}, { _id: false }); // _id: false prevents Mongoose from creating IDs for each array item


const TranscriptDataSchema = new mongoose.Schema({
    langCode: {
        type: String,
        required: true
    },
    transcript: {
        type: [TranscriptItemSchema],
        required: true
    },
    translation: {
        type: [String],
        required: true
    }
});

const GlobalCacheSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true,
    },
    transcriptData: [TranscriptDataSchema],
},
    { timestamps: true }
);

GlobalCacheSchema.index({ videoId: 1, "transcriptData.langCode": 1 });

const GlobalCache = mongoose.models.globalCache || mongoose.model("globalCache", GlobalCacheSchema);

export default GlobalCache;