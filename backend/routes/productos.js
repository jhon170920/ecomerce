import express from "express";
import productos from "../models/productos.js";

const router = express.Router();

router.post("/", async function (req, res) {
  try {
    const { productId, Nombre, Descripcion, Precio, Imagen } = req.body;

    const newProduct = new productos({
      productId,
      Nombre,
      Descripcion,
      Precio,
      Imagen,
    });

    await newProduct.save();
    res.status(201).json({ message: "Producto guardado con éxito" });
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    res.status(400).json({ message: "Error al ingresar el producto" });
  }
});

router.get('/', async (req, res) => {
  try{
    const ListProductos = await productos.find();
  res.json(ListProductos)
  }catch (error){
    res.status(500).json({message:"Error al obtener los productos"});
  }
});
// 👇 Esta linea es critica para que sea accesible el server.js
export default router;
