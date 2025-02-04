"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Producto } from "../../../../lib/types";

export default function ProductoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      console.error("No se proporcionó un ID válido.");
      router.push("/productos");
      return;
    }

    const fetchProducto = async () => {
      try {
        const productoRef = doc(db, "productos", id);
        const productoSnap = await getDoc(productoRef);

        if (productoSnap.exists()) {
          setProducto(productoSnap.data() as Producto);
        } else {
          console.error("No se encontró el producto.");
          router.push("/productos");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        router.push("/productos");
      }
    };

    fetchProducto();
  }, [id, router]);

  if (!producto) {
    return <p className="text-center text-gray-500 mt-10">Cargando producto...</p>;
  }

  return (
    <div className="container mx-auto py-12 px-6 relative">
      {/* Botón "Atrás" */}
      <button
        onClick={() => router.push("/public/productos")}
        className="absolute top-0 left-0 mt-4 ml-4 flex items-center text-gray-600 hover:text-gray-900 transition duration-200"
      >
        <span className="text-2xl">←</span>
        <span className="ml-2 text-lg font-medium">Atrás</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
        {/* Carrusel de imágenes (Columna izquierda) */}
        <div className="relative w-full flex flex-col items-center">
          {/* Imagen principal */}
          <img
            src={producto.imagenesURLs[currentImageIndex]}
            alt={`${producto.nombre} - Imagen ${currentImageIndex + 1}`}
            className="w-full h-auto rounded-lg shadow-lg object-contain"
          />

          {/* Miniaturas debajo de la imagen principal */}
          <div className="flex mt-4 space-x-2">
            {producto.imagenesURLs.map((imagen, index) => (
              <img
                key={index}
                src={imagen}
                alt={`Miniatura ${index + 1}`}
                className={`h-16 w-16 object-contain border-2 rounded-md cursor-pointer ${
                  currentImageIndex === index ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Información del producto (Columna derecha) */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Marca */}
          <p className="text-lg font-semibold text-gray-500 uppercase font-['Oswald']">
            {producto.marca}
          </p>

          {/* Nombre del Producto */}
          <h1 className="text-5xl font-bold tracking-wide text-gray-900 font-['Bebas Neue']">
            {producto.nombre}
          </h1>

          {/* Descripción */}
          <p className="text-lg leading-relaxed text-gray-700 font-light font-['Inter'] text-justify">
            {producto.descripcion}
          </p>

          {/* Precio */}
          <p className="text-4xl font-extralight text-gray-900 font-['Oswald']">
            ${producto.precio.toLocaleString("es-CL")}
          </p>
        </div>
      </div>
    </div>
  );
}
