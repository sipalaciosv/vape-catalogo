"use client";

import React, { useState } from "react";
import { Producto } from "../../lib/types";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface EditProductFormProps {
  producto: Producto; // Producto que se editará
  onClose: () => void; // Función para cerrar el formulario de edición
}

export default function EditProductForm({ producto, onClose }: EditProductFormProps) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [precio, setPrecio] = useState(producto.precio);
  const [categoria, setCategoria] = useState(producto.categoria);
  const [marca, setMarca] = useState(producto.marca);
  const [stock, setStock] = useState(producto.stock);
  const [imagenesURLs, setImagenesURLs] = useState<string[]>(producto.imagenesURLs || []);
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);
  const [portadaIndex, setPortadaIndex] = useState(producto.portadaIndex || 0);
  const [tags, setTags] = useState<string[]>(producto.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNuevasImagenes((prev) => [...prev, ...files]);

    // Generar previsualizaciones para las nuevas imágenes
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagenesURLs((prev) => [...prev, ...previews]);
  };

  const handleEliminarImagen = (index: number) => {
    if (index < producto.imagenesURLs.length) {
      // Eliminar imagen existente
      setImagenesURLs((prev) => prev.filter((_, i) => i !== index));
      if (portadaIndex === index) {
        setPortadaIndex(0); // Cambiar la portada si se eliminó
      }
    } else {
      // Eliminar nueva imagen
      setNuevasImagenes((prev) => prev.filter((_, i) => i !== index - producto.imagenesURLs.length));
      setImagenesURLs((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const subirImagenesACloudinary = async (imagenes: File[]): Promise<string[]> => {
    const urls: string[] = [];
    const cloudinaryURL = "https://api.cloudinary.com/v1_1/dayomnbka/image/upload"; // Cambia según tu configuración
  
    for (const imagen of imagenes) {
      try {
        const formData = new FormData();
        formData.append("file", imagen);
        formData.append("upload_preset", "vape_catalogo"); // Cambia según tu configuración
  
        const response = await fetch(cloudinaryURL, {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          console.error("Error al subir la imagen a Cloudinary:", response.statusText);
          continue; // Pasa a la siguiente imagen
        }
  
        const data = await response.json();
        if (!data.secure_url) {
          console.error("La respuesta de Cloudinary no contiene secure_url.");
          continue; // Pasa a la siguiente imagen
        }
  
        urls.push(data.secure_url); // Añade la URL válida
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }
  
    return urls;
  };
  
  const handleGuardarCambios = async () => {
    if (!nombre || !descripcion || !precio || !categoria || !marca || !stock) {
      alert("Completa todos los campos.");
      return;
    }
  
    try {
      // Subir las nuevas imágenes seleccionadas a Cloudinary
      const nuevasURLs = await subirImagenesACloudinary(nuevasImagenes);
  
      // Combinar las URLs existentes con las nuevas
      const todasLasImagenesURLs = [...imagenesURLs.filter((url) => !url.startsWith("blob:")), ...nuevasURLs];
  
      const productoActualizado = {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria,
        marca,
        stock: Number(stock),
        imagenesURLs: todasLasImagenesURLs,
        portadaIndex,
        tags,
      };
  
      const productoRef = doc(db, "productos", producto.id);
      await updateDoc(productoRef, productoActualizado);
  
      alert("Producto actualizado.");
      onClose();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Hubo un error al actualizar el producto.");
    }
  };
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Producto</h2>
      <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Marca"
          className="border p-2 rounded"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categoría"
          className="border p-2 rounded"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          className="border p-2 rounded"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Stock"
          className="border p-2 rounded"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
        <textarea
          placeholder="Descripción"
          className="border p-2 rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {/* Imágenes */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Imágenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="border p-2 rounded"
            onChange={handleImagenesChange}
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {imagenesURLs.map((url, index) => (
              <div
                key={index}
                className={`relative border p-2 rounded ${portadaIndex === index ? "border-blue-500" : ""}`}
                onClick={() => setPortadaIndex(index)}
              >
                <img src={url} alt={`Imagen ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                {portadaIndex === index && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                    Portada
                  </span>
                )}
                <button
                  type="button"
                  className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded"
                  onClick={() => handleEliminarImagen(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Etiquetas */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Etiquetas</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Añadir etiqueta..."
              className="border p-2 rounded flex-1"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setTags([...tags, tagInput]);
                  setTagInput("");
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded flex items-center">
                {tag}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleGuardarCambios}
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
