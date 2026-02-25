import {Schema, model} from "mongoose";

const messageSchema = new Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const threadSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    threadId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Thread = model("Thread", threadSchema);

export default Thread;