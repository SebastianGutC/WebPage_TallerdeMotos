import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/taller_notos")
        console.log("DB connected")
    } catch (error) {
        console.error("DB connection error:", error)
    }
}
