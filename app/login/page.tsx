"use client";

import { auth, provider, db } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        // Verificar el UID en Firestore
        const adminRef = doc(db, "config", "admin");
        const adminDoc = await getDoc(adminRef);

        if (adminDoc.exists()) {
          if (adminDoc.data().uid === user.uid) {
            alert(`Bienvenido, ${user.displayName}`);
            router.push("/admin");
          } else {
            alert("No tienes permisos para acceder.");
            await auth.signOut();
          }
        } else {
          await setDoc(adminRef, { uid: user.uid });
          alert("Te has registrado como administrador.");
          router.push("/admin");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido</h1>
        <p className="text-gray-600 mb-6">
          Accede al panel de administración usando tu cuenta de Google.
        </p>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
          onClick={handleLogin}
        >
          Iniciar Sesión con Google
        </button>
      </div>
    </div>
  );
}
