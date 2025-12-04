import mongoose from "mongoose";
import Mongoose from "mongoose";
import product from "./productos";

const pedidosshema = new mongoose.Schema({
    productoid: {type:String, required:true,unique:true},
    Nombre_producto:{type:String, required:true},
    Descripcion:{type:String, required:true},
    Precio:{type:Number, required:true},
    Imagen:{type:String, required:true},
    Estado_pedido:{type:}
})