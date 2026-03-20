import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
})



mongoose.connect(process.env.MONGO_URL)
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch((err) => console.error("Could not connect to MongoDB", err));