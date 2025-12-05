import Pedido from "../models/pedidos.js";

// CREAR PEDIDO CON VALIDACIÓN DE SEGURIDAD
export const crearPedido = async (req, res) => {
    console.log("\n🔍 === VALIDACIÓN DE PEDIDO INICIADA ===");
    
    try {
        const { productos, precio_total, email, telefono, direccion, metodo_pago } = req.body;

        console.log("📦 Productos recibidos:", productos?.length || 0);
        console.log("💰 Precio recibido del frontend:", precio_total);

        // ============================================
        // VALIDACIONES BÁSICAS
        // ============================================
        if (!productos || productos.length === 0) {
            console.log("❌ RECHAZADO: Sin productos");
            return res.status(400).json({ 
                success: false,
                message: "El pedido debe contener al menos un producto" 
            });
        }

        if (!email || !telefono || !direccion || !metodo_pago) {
            console.log("❌ RECHAZADO: Faltan campos obligatorios");
            return res.status(400).json({ 
                success: false,
                message: "Faltan campos obligatorios" 
            });
        }

        if (!precio_total || precio_total <= 0) {
            console.log("❌ RECHAZADO: Precio total inválido");
            return res.status(400).json({ 
                success: false,
                message: "El precio total debe ser mayor a 0" 
            });
        }

        // ============================================
        // 🔒 VALIDACIÓN DE SEGURIDAD: RECALCULAR PRECIO
        // ============================================
        console.log("\n🧮 Recalculando precio en el servidor...");
        
        const precioCalculadoServidor = productos.reduce((total, item) => {
            const precio = Number(item.precio) || 0;
            const cantidad = Number(item.cantidad) || 0;
            const subtotal = precio * cantidad;
            
            console.log(`  • ${item.nombre}: $${precio.toLocaleString()} x ${cantidad} = $${subtotal.toLocaleString()}`);
            
            return total + subtotal;
        }, 0);

        const diferencia = Math.abs(precioCalculadoServidor - precio_total);

        console.log(`\n💵 Precio que envió el frontend: $${precio_total.toLocaleString()}`);
        console.log(`💵 Precio calculado por servidor: $${precioCalculadoServidor.toLocaleString()}`);
        console.log(`📊 Diferencia encontrada: $${diferencia.toLocaleString()}`);

        // ⚠️ VALIDACIÓN CRÍTICA: Diferencia máxima permitida = $1
        if (diferencia > 1) {
            console.log("\n🚨🚨🚨 ¡¡¡FRAUDE DETECTADO!!! 🚨🚨🚨");
            console.log(`❌ La diferencia de $${diferencia.toLocaleString()} excede el límite permitido`);
            console.log("❌ PEDIDO RECHAZADO POR MANIPULACIÓN DE PRECIO\n");
            
            return res.status(400).json({ 
                success: false,
                message: "⚠️ Error en el cálculo del precio total",
                detalle: `Precio esperado: $${precioCalculadoServidor.toLocaleString()}, pero recibimos: $${precio_total.toLocaleString()}`,
                diferencia: diferencia,
                fraud_detected: true
            });
        }

        console.log("✅ Validación de precio APROBADA");

        // ============================================
        // USAR EL PRECIO DEL SERVIDOR (MÁS SEGURO)
        // ============================================
        const precioFinal = precioCalculadoServidor;

        // Formatear productos
        const productosFormateados = productos.map(item => ({
            producto_id: item.producto_id,
            nombre_producto: item.nombre,
            precio_unitario: Number(item.precio),
            cantidad: Number(item.cantidad)
        }));

        // Crear pedido
        const newPedido = new Pedido({
            productos: productosFormateados,
            precio_total: precioFinal,  // ⚠️ Usar precio del servidor, NO del cliente
            email,
            telefono,
            direccion,
            metodo_pago,
            fecha_pedido: new Date(),
            estado_pedido: 'pendiente'
        });

        await newPedido.save();
        
        console.log(`\n✅✅✅ PEDIDO GUARDADO CON ÉXITO ✅✅✅`);
        console.log(`📋 ID del pedido: ${newPedido._id}`);
        console.log(`💰 Total: $${precioFinal.toLocaleString()}`);
        console.log(`📊 Estado: ${newPedido.estado_pedido}\n`);
        
        res.status(201).json({ 
            success: true,
            message: "Pedido creado con éxito",
            pedido: {
                id: newPedido._id,
                total: precioFinal,
                estado: newPedido.estado_pedido
            }
        });
        
    } catch (error) {
        console.error("\n❌ ERROR AL GUARDAR EL PEDIDO:");
        console.error(error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: "Error de validación",
                errores: Object.values(error.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: "Error interno del servidor" 
        });
    }
};