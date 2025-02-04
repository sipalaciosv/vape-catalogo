"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddProductForm() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [portadaIndex, setPortadaIndex] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImagenes(files);

    // Generar las previsualizaciones
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviews(previews);
  };

  const subirImagenesACloudinary = async (): Promise<string[]> => {
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
          alert("Una imagen no pudo subirse correctamente.");
          continue; // Pasa a la siguiente imagen
        }
  
        const data = await response.json();
        if (!data.secure_url) {
          console.error("La respuesta de Cloudinary no contiene secure_url.");
          alert("Una imagen no tiene URL válida.");
          continue; // Pasa a la siguiente imagen
        }
  
        urls.push(data.secure_url); // Añade la URL válida
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("Error al subir una imagen. Revisa la consola para más detalles.");
      }
    }
  
    return urls;
  };
  

  const handleAgregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !descripcion || !precio || !categoria || !marca || !stock || imagenes.length === 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      setSubiendo(true);

      // Subir imágenes a Cloudinary
      const urls = await subirImagenesACloudinary();

      // Guardar los datos del producto en Firestore
      const producto = {
        nombre,
        descripcion,
        precio: Number(precio),
        categoria,
        marca,
        stock: Number(stock),
        imagenesURLs: urls,
        portadaIndex,
        tags,
        fechaCreacion: new Date(),
      };

      await addDoc(collection(db, "productos"), producto);

      alert("Producto agregado con éxito.");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");
      setMarca("");
      setStock("");
      setImagenes([]);
      setPreviews([]);
      setPortadaIndex(0);
      setTags([]);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Hubo un error al agregar el producto.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Añadir Producto</h2>

      <form className="grid grid-cols-1 gap-4" onSubmit={handleAgregarProducto}>
        <input
          type="text"
          placeholder="Nombre del producto"
          className="border p-2 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Descripción del producto"
          className="border p-2 rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          className="border p-2 rounded"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Categoría"
          className="border p-2 rounded"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <input
          type="text"
          placeholder="Marca"
          className="border p-2 rounded"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock disponible"
          className="border p-2 rounded"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />

        {/* Input para subir múltiples imágenes */}
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
            {previews.map((preview, index) => (
              <div
                key={index}
                className={`relative border p-2 rounded ${portadaIndex === index ? "border-blue-500" : ""}`}
                onClick={() => setPortadaIndex(index)}
              >
                <img src={preview} alt={`Imagen ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                {portadaIndex === index && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                    Portada
                  </span>
                )}
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
                  if (tagInput.trim() !== "") {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded flex items-center">
                {tag}
                <button type="button" className="ml-2 text-red-500" onClick={() => setTags(tags.filter((t, i) => i !== index))}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${subiendo ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={subiendo}
        >
          {subiendo ? "Subiendo..." : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
}
