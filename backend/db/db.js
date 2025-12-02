import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
.then(()=>console.log("✅conectado en la base de datos 💚"))
.catch(err => console.log("❌ Error al concetar en la base de datos 💔"));