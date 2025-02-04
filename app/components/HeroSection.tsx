export default function HeroSection() {
  return (
    <div
      className="relative bg-cover bg-center h-64 md:h-96"
      style={{ backgroundImage: "url('/vapes.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide">
          Descubre tu Estilo
        </h1>
        <p className="mt-4 text-lg md:text-xl font-light">
          Explora nuestra amplia selección de vapes desechables y accesorios de la mejor calidad.
        </p>

      </div>
    </div>
  );
}
