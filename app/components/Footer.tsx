export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} House of Vape. Todos los derechos reservados.
          </p>
          
        </div>
      </footer>
    );
  }
  