"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import styles from "../app/register/register.module.css";

export default function RegisterPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false); // Estado para verificar se estamos no cliente
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Marca que o componente está no lado do cliente
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validação simples
    if (!email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    try {
      if (isClient) { // Verifica se estamos no cliente
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess(true);
        setError(null);
        router.push("/login"); // Redireciona para a página de login
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email já está em uso.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    }
  };

  // Só renderiza o formulário se for no cliente
  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <div className={styles.registerForm}>
        <h1>Registrar</h1>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Conta criada com sucesso!</p>}
        <form onSubmit={handleRegister}>
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme a senha"
          />
          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}
