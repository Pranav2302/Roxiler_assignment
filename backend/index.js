import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import adminRoutes  from "./routes/admin.js"
import dotenv from "dotenv";
dotenv.config();

const app = express();

//allow local and deployed backend url
const allowedOrigin = [
    'https://roxiler-assignment-amber.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://roxiler-assignment-pied.vercel.app',
].filter(Boolean);

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message:'Api is runnig'});
});

app.use('/api/auth',authRoutes);

app.use('/api',adminRoutes );

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Listning on port ${PORT}`)
});



