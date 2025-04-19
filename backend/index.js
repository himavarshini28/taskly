import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {userModel ,todoModel } from "./db.js";

const app=express();
app.use(express.json());
const jwt_secret="lets_todos"

await mongoose.connect('mongodb+srv://himavarshini28245:HimaVarshini@cluster0.gdkjw.mongodb.net/todo-app')
.then(()=>{
    console.log("DB connected");
})
.catch(()=>{
    console.log("error connecting to MongoDB")
})

const auth=async (req,res,next)=>
    {
        const token=req.headers.token;
        console.log(token);
        const userId=jwt.verify(token,jwt_secret);
        console.log(userId)
        const response=await userModel.findOne({_id:userId.id});
        if(response)
        {   console.log(response);
            req.userId=response._id;
            next()
        }
        else{
            res.send(
                {
                    "message":'incorrect credentials',
                }
            )
        }
    }


app.post('/signup',async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    await userModel.create(
        {
            name,
            email,
            password
        }
    )
    res.json(
        {
            "message":"user signed in",
        }
    )
})

app.post('/signin',async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const foundUser=await userModel.findOne({
        email,
        password,
    })
    if(foundUser)
    {
        const token=jwt.sign(
            {
                id:foundUser._id
            }
            ,jwt_secret
        )
        res.json({
            "token":token,
        })
    }
    else{
        res.status(403).json({
            "message":"incorrect user credentials",
        })
    }
})

app.post('/todo',auth,(req,res)=>{
    if(req.userId)
    {
        res.json({
            UserId:req.userId,
        })
    }
    else{
        res.json({
            "message":"user not authenticated",
        })
    }
})

app.get('/todos',auth,(req,res)=>{
    if(req.userId)
        {
            res.json({
                UserId:req.userId,
            })
        }
        else{
            res.json({
                "message":"user not authenticated",
            })
        }
})

app.listen(3000,()=>{
    console.log("listening to port 3000");
})