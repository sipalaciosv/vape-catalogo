"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-navbar text-white shadow-md z-50 relative">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          House of Vape
        </h1>
        {/* Botón de menú para dispositivos móviles */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {/* Icono de hamburguesa */}
          {isOpen ? "✕" : "☰"}
        </button>
        {/* Links del menú */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-navbar md:relative md:top-0 md:left-auto md:w-auto md:flex md:items-center z-50`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-4">
            <li>
              <Link
                href="/"
                className="block py-2 px-4 hover:bg-gray-700 md:hover:underline"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/public/productos"
                className="block py-2 px-4 hover:bg-gray-700 md:hover:underline"
              >
                Catálogo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
