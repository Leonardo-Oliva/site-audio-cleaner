"use client";

import dynamic from "next/dynamic";

// Usando dynamic import para carregar o conteúdo da página de download no lado do cliente
const DownloadPageContent = dynamic(() => import("../../components/Download"), { ssr: false });

export default function DownloadPage() {
  return <DownloadPageContent />;
}
