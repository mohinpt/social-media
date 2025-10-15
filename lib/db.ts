import mongoose from "mongoose";

const db_url = process.env.MONGODB_URL!;

if (!db_url) {
    throw new Error("mongodb url not found!");
}

let cashed = global.mongoose;

if (!cashed) {
    cashed = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
    if (cashed.conn) {
        return cashed.conn;
    }

    if (!cashed.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }

        cashed.promise = mongoose.connect(db_url, opts)
            .then(() => mongoose.connection);
    }

    try {
        cashed.conn = await cashed.promise;
    } catch (error) {
        cashed.promise = null;
        throw error;
    }

    return cashed.conn;
}