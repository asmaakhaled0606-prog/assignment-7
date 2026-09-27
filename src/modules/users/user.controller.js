import { Router } from "express";
import * as US from "./user.service.js";

const userRouter = Router();

userRouter.post("/signup", US.signUp);

userRouter.post("/login", US.login);

userRouter.patch("/:id", US.updateUser);

userRouter.delete("/", US.deleteUser);

userRouter.get("/", US.getUser);

export default userRouter;

