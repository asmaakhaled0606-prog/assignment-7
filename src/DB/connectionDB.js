import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/StickyNotesApp", { serverSelectionTimeoutMS: 10 * 1000 })
    .then(()=>{
        console.log("db connected successfully😍")
    })
    .catch((err)=>{
        console.log(err,"db connection failed😭")
    })
};

export default connectDB;