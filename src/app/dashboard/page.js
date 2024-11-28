import dynamic from "next/dynamic";

// Carrega o componente Dashboard de forma dinâmica, desativando a renderização no servidor
const Dashboard = dynamic(() => import("../../components/Dashboard"), {
  ssr: false, // Desativa a renderização do lado do servidor
});

export default function Page() {
  return <Dashboard />;
}
