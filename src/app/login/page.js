"use client";

import dynamic from "next/dynamic";

// Usando dynamic import para carregar o conteúdo da página de login no lado do cliente
const LoginPageContent = dynamic(() => import("../../components/Login"), { ssr: false });

export default function LoginPage() {
  return <LoginPageContent />;
}
