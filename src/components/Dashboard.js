// src/components/Dashboard.js
"use client";

import { useEffect, useState } from "react";
import { auth } from "./../lib/firebase";
import { useRouter } from "next/navigation";
import styles from "../app/dashboard/dashboard.module.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          router.push("/login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [router]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      await auth.signOut();
      router.push("/login");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null; // O redirecionamento será tratado pelo useEffect
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.welcome}>Bem-vindo, {user.email.split("@")[0]}</p>
      <p className={styles.description}>
        Esta aplicação permite que você envie áudios para tratamento, garantindo uma qualidade aprimorada e pronta para uso profissional.
      </p>
      <button className={styles.button} onClick={() => router.push("/download")}>
        Audios Tratados
      </button>
      <button className={styles.button} onClick={() => router.push("/upload")}>
        Enviar audio para tratamento
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
