// lib/types.ts
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenesURLs: string[]; // Array de URLs de las imágenes
  portadaIndex: number; // Índice de la imagen de portada
  stock: number; // Cantidad en stock
  categoria: string;
  marca: string;
  tags: string[]; // Array de etiquetas
}
