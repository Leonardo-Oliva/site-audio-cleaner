import dynamic from "next/dynamic";

// Carrega o componente Login de forma dinâmica, desativando a renderização no servidor
const Login = dynamic(() => import("../../components/Upload"), {
  ssr: false, // Desativa a renderização do lado do servidor
});

export default function Page() {
  return <Login />;
}
