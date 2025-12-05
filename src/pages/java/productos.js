async function cargarProductos() {
    try{
        const response= await fetch('https://ecomerce-c5tt.onrender.com/api/productos');
        const Productos=await response.json();

        const grid= document.getElementById('Product-grid');
              grid.innerHTML=Productos.map(Producto=>`

                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
                    data-category="laptops"
                    data-price="${Producto.Precio}"
                    data-product-id="${Producto.productId}">
                
                <div class="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden">
                <img src="${Producto.Imagen}" alt="${Producto.Nombre}"
                class="w-full h-full object-cover  hover: scale-105 transition transform duration-300"
                loading="lazy">

                <div  class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -15%
                </div>
                </div>
                
                <div class="p-6">
                <h3 class="text-lg font-bold text-gray-800">
                ${Producto.Nombre}
                </h3>

                <p class="text-sm text-gray-800 mb-4">
                ${Producto.Descripcion}
                </p>
                
                <div class=flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-blue-600">
                ${(Producto.Precio ||0).toLocaleString('es-Co')}
                </span>
                </div>

                <div class="flex text-yellow-600">
                ⭐️⭐️⭐️⭐️⭐️
                </div>
                </div>
                <div class="flex space-x-2">
                <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                Ver Detalles
                </button>
                <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                Comprar
                </button>
                </div>
                </div>
                </div>

                `).join('');
                console.log("productos cargados con exito");
                enlazarEventosDeCompra();
    } catch (error){
        console.error("Error al cargar los productos",error);
}

}
//
cargarProductos();

// Contador del icono de carrito
const cartCounter = document.getElementById("cart-counter");

// Estado del carrito (persistente)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Actualiza el contador visual del carrito
function actualizarContador() {
  const totalItems = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
  if (totalItems > 0) {
    cartCounter.style.display = "flex";
    cartCounter.textContent = totalItems;
  } else {
    cartCounter.style.display = "none";
  }
}

// Enlaza los eventos "Comprar" a las tarjetas renderizadas
function enlazarEventosDeCompra() {
  document.querySelectorAll(".add-to-cart-btn").forEach(boton => {
    boton.addEventListener("click", () => {
      const card = boton.closest(".product-card");
      if (!card) return;

      const id = card.dataset.productId;
      const precio = parseFloat(card.dataset.price) || 0;
      const nombre = card.querySelector("h3").textContent.trim();
      const imagen = card.querySelector("img").src; // Sin esto no aparece la imagen en carrito.html y su js

      const existente = carrito.find(item => item.id === id);

      if (existente) {
        existente.cantidad += 1;
      } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 }); // Agregar todos los campos de productos y cantidad
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarContador();

      cartCounter.classList.add("animate-pulse");
      setTimeout(() => cartCounter.classList.remove("animate-pulse"), 300);
    });
  });
}
actualizarContador();
