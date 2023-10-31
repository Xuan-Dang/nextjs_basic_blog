import mongoose from "mongoose";

async function db() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connect db success");
    }catch(error) {
        console.log(error.message)
    }
}

export default db;