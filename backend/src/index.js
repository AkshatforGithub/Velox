import  express from "express";
import  authRoutes  from "./routes/auth.router.js";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import messageRoutes from "./routes/message.router.js"
import cors from "cors";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT

app.use(cookieparser());

app.use(express.json());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

 app.listen(PORT, () => {
    console.log("server is running on PORT :"+PORT);
    connectDB();
 });