import express from "express";
import connectDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import noteRouter from "./modules/notes/note.controller.js";

const app = express();

const port = 3000;

const bootstrap = async () => {

    app.use(express.json());

    app.get("/", (req, res) => res.status(200).json({ message: "Welome to Sticky Notes app 📝" }));

    await connectDB();

    app.use("/users", userRouter);

    app.use("/notes", noteRouter);

    app.listen(port, ()=> console.log(`Server running on port ${port}`));

}

export default bootstrap;