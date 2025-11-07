import express from "express"
import user from "../models/user.js"

const router = express.Router();
//Ruta para registrar
router.post("/register", async(req, res) => {
    try {
        const{email, name, pass, tel}=req.body;
        //validar informacion
        if (!email||!name||!pass||!tel){
            return res.status(400).json({message: "llene los campos"})
         }         
        //valida el usuario si ya exite
        const existeUsuario = await user.find({email});
        if(existeUsuario){
            return res.status(400).json({message:"Usuario ya esta registrado"});
        }
        //Crear usuario en la base de datos
        const newusuario = new user({email, name, pass, tel});
        await newusuario.save();
        resizeTo.status(201).json({message: "Usuario registrado con exito"});
    }catch (error) {
        res.status(500).json({message: "Error al registrar el usuario", error:error.message});
    }
    
});
export default router

