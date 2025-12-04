import pedido  from "../models/pedidos.js";

//crear pedido

export const crearPedido = async (req, res) =>{
    try {
        const{producto_id,nombre_producto,precio_pedido, email, telefono, estado_pedido, fecha_pedido, direccion, metodo_pago} = req.body;

        const newPedido = new pedido({
            producto_id,
            nombre_producto,
            precio_pedido,
            email,
            telefono,
            estado_pedido,
            fecha_pedido,
            direccion,
            metodo_pago
        });
        await newPedido.save();
        res.status(201).json({message: "pedido guardado con exito"});
    } catch (error) {
        console.error("Error al guardar el pedido:", error);
        res.status(400).json({message:"Error al ingresar el pedido"})      
    }
};
// //OBTENER LOS PEDIDOS
// export const obtenerPedidos = async (req, res) =>{
// try {
//     const ListPedidos = await pedido.find();
//     res.json(ListPedidos)
// } catch (error) {
//     res.status(500),json({message:"Error al obtener los pedidos"})
// }};