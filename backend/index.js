import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message:'Api is runnig'});
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Listning on port ${PORT}`)
});



