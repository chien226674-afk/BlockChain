import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function check() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI ? "URI found" : "URI MISSING");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!");
        const users = await User.find({}, 'username walletAddress');
        console.log("Found users:", users.length);
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
