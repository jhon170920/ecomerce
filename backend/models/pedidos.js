import mongoose from "mongoose";
const pedidosshema = new mongoose.Schema({
    producto_id: {type:[String], required:true,unique:true},
    nombre_producto:{type:[String], required:true},
    precio_pedido:{type:Number, required:true},
    email:{type:String, required:true},
    telefono:{type:Number, required:true},
    estado_pedido:{type:String, enum:['pendiente','precesando', 'entregado','cancelado'], default:'pendiente'},
    fecha_pedido:{type:Date, required:true},
    direccion:{type:String, required:true},
    metodo_pago:{type:String, required:true},
});
//la conexion se guarda
const pedido=mongoose.model("pedidos", pedidosshema, "pedidos")

export default pedido;