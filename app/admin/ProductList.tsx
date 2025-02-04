"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Producto } from "../../lib/types";

export default function ProductList({ onEdit }: { onEdit: (producto: Producto) => void }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [pageSize] = useState(5); // Número de productos por página

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosSnapshot = await getDocs(collection(db, "productos"));
        const productosData = productosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Producto[];
        setProductos(productosData);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Calcular el total de páginas
  const totalPages = Math.ceil(productos.length / pageSize);

  // Obtener los productos de la página actual
  const currentProducts = productos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de Productos</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="border p-4 text-left">Nombre</th>
              <th className="border p-4 text-left">Categoría</th>
              <th className="border p-4 text-left">Marca</th>
              <th className="border p-4 text-left">Precio</th>
              <th className="border p-4 text-left">Stock</th>
              <th className="border p-4 text-left">Etiquetas</th>
              <th className="border p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No hay productos disponibles.
                </td>
              </tr>
            ) : (
              currentProducts.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="border p-4">{producto.nombre}</td>
                  <td className="border p-4">{producto.categoria}</td>
                  <td className="border p-4">{producto.marca}</td>
                  <td className="border p-4">${producto.precio.toLocaleString("es-CL")}</td>
                  <td className="border p-4">{producto.stock}</td>
                  <td className="border p-4">
                    {producto.tags?.length ? (
                      <ul className="list-disc pl-4">
                        {producto.tags.map((tag, index) => (
                          <li key={index} className="text-gray-600 text-sm">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 text-sm">Sin etiquetas</span>
                    )}
                  </td>
                  <td className="border p-4">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-1 rounded"
                      onClick={() => onEdit(producto)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
