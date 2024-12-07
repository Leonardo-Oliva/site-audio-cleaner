"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import styles from "../app/login/login.module.css";
import Link from "next/link";

export default function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          router.push("/dashboard");
        }
      });
      return () => unsubscribe(); // Limpa o listener ao desmontar o componente
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <h1>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <button type="submit">Entrar</button> 
          <Link href="/register">
            <button className={styles.button}>Registrar</button>
          </Link>
        </form>
      </div>
    </div>
  );
}
