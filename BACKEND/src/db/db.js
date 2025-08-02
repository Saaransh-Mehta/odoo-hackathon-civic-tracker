import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const dbUri = `${process.env.DB_URI}${process.env.DB_NAME}`;
        await mongoose.connect(dbUri);
        console.log("Database Connected");
    } catch (error) {
        console.log("Error While Connecting Database:", error);
    }
};
