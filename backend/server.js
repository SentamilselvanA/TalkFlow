import express from "express";
import dotenv from "dotenv";
dotenv.config;
const app = express();
const PORT=process.env.PORT
app.get("/api/auth/signup", (req, res) => {
    res.send("Signup ");
});

app.get("/api/auth/login", (req, res) => {
    res.send("Login ");
});

app.get("/api/auth/logout",(req,res)=>{
    res.send("Logout")
})

app.listen(PORT,()=>
{
    console.log('chatbot is running${PORT}');
})