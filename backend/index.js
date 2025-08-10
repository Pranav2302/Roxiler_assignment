import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message:'Api is runnig'});
});

app.use('/api/auth',authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Listning on port ${PORT}`)
});



