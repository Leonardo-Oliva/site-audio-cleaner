"use client";

import dynamic from "next/dynamic";

// Usando dynamic import para carregar o conteúdo da página de registro no lado do cliente
const RegisterPageContent = dynamic(() => import("../../components/Register"), { ssr: false });

export default function RegisterPage() {
  return <RegisterPageContent />;
}
