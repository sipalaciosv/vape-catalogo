"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebase";

import AddProductForm from "../admin/AddProductForm";
import ProductList from "../admin/ProductList";
import EditProductForm from "../admin/EditProductForm";
import { Producto } from "../../lib/types";

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const adminRef = doc(db, "config", "admin");
        const adminDoc = await getDoc(adminRef);

        if (adminDoc.exists() && adminDoc.data().uid === currentUser.uid) {
          setUser(currentUser);
        } else {
          alert("Acceso restringido. Redirigiendo...");
          await auth.signOut();
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Productos</h1>

      {productoEditando ? (
        <EditProductForm producto={productoEditando} onClose={() => setProductoEditando(null)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AddProductForm />
          <ProductList onEdit={(producto) => setProductoEditando(producto)} />
        </div>
      )}
    </div>
  );
}
