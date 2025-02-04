"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import HeroSection from "../../components/HeroSection";
import { Producto } from "../../../lib/types";

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "productos"));
      setProductos(
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Producto)
        )
      );
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Contenido principal */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => {
            const portada =
              producto.imagenesURLs && producto.imagenesURLs[producto.portadaIndex]
                ? producto.imagenesURLs[producto.portadaIndex]
                : "https://via.placeholder.com/150"; // Imagen de respaldo

            return (
              <div
                key={producto.id}
                onClick={() => router.push(`/public/productos/${producto.id}`)} // Redirección
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                {/* Imagen del producto sin recortes */}
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  <img
                    src={portada}
                    alt={producto.nombre}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Información del producto */}
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    {producto.marca}
                  </p>
                  <h2 className="text-lg font-bold mt-1">{producto.nombre}</h2>
                  <p className="text-2xl text-gray-900 mt-2 font-[Oswald] font-extralight">
  ${producto.precio.toLocaleString("es-CL")}
</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
