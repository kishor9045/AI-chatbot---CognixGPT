import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import chat from "./routes/Chat.js";
import User from "./routes/User.js";
const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true, limit: "40kb"}));

const main = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
    }catch(err){
        console.log(err);
    }
}
main().then(() => {
    console.log("connection to mongoDb successful!");
}).catch(err => console.log(err));

app.use("/api/v1/", chat);
app.use("/api/v1/", User);

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.listen(PORT, () => {
    console.log(`Listening to port http://localhost:${PORT}`);
});