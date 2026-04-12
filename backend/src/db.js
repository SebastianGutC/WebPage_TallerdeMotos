import mongoose from 'mongoose';
import { config } from './config.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodbUri)
        console.log("DB connected")
    } catch (error) {
        console.error("DB connection error:", error)
    }
}
