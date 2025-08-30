import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

//allow local and deployed backend url
const allowedOrigin = [
    
]

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message:'Api is runnig'});
});
const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Listning on port ${PORT}`)
});

