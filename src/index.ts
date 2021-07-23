import express from "express";
import LoginRouter from "./routers/loginRouter";
import cors from 'cors';
import signupRouter from "./routers/signupRouter";
import gameRouter from './routers/gameRouter';
import { frontendURL } from "./constants";
import { createServer } from "http";
import { initSocket } from './connection/socket';
import profileRouter from "./routers/profileRouter";
import { tokenCheck } from "./auth/tokenFuncs";

const app = express();
export const httpServer = createServer(app);
const port = process.env.PORT || 3005; // default port to listen

app.use(cors({
  origin: frontendURL
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define a route handler for the default home page
app.use("/signup", signupRouter);
app.use("/login", LoginRouter);

app.use(tokenCheck);
app.use("/profile", profileRouter);
app.use("/game", gameRouter);

// start the Express server
httpServer.listen( port, () => console.log('listening on port', port));
initSocket(httpServer);

export default app;