import PublicLayout from "./public/layout"; // Importa el layout de rutas públicas
import Link from "next/link";
export default function Home() {
  return (
    <PublicLayout>
      <div className="bg-gray-100 min-h-screen">
        {/* Sección principal con imagen de fondo */}
        <div
          className="relative bg-cover bg-center h-screen"
          style={{ backgroundImage: "url('/home1.webp')" }} // Cambia la URL según la imagen deseada
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Contenido */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide">
              Bienvenido a House of Vape
            </h1>
            <p className="mt-4 text-lg md:text-xl font-light">
              Explora nuestra selección de vapes de alta calidad.
            </p>
            <Link href="/public/productos" className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition">
  Ver Catálogo
</Link>
          </div>
        </div>

        {/* Mosaico de imágenes */}
        <div className="grid grid-cols-3 gap-0 h-[400px]">
          {[
            "/image1.jpg",
            "/image2.jpg",
            "/image3.jpg",
          ].map((image, index) => (
            <div key={index} className="relative w-full h-full">
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
