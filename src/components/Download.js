"use client";

import { useState, useEffect } from "react";
import { storage } from "../lib/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../app/download/downloadPage.css"; // Importando o CSS

export default function DownloadPageContent() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchFiles = async (user) => {
        const folderRef = ref(storage, `${user.uid}`);
        try {
          const res = await listAll(folderRef);
          const filePromises = res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url };
          });
          const filesList = await Promise.all(filePromises);
          setFiles(filesList);
        } catch (err) {
          console.error("Erro ao listar arquivos:", err);
          setError("Erro ao listar arquivos.");
        } finally {
          setLoading(false);
        }
      };

      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchFiles(user);
        } else {
          setError("Usuário não autenticado.");
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="download-container">
      <h1>Audios Processados</h1>
      {loading && <p>Carregando arquivos...</p>}
      {error && <p>{error}</p>}
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.name} className="file-item">
            {/* Botão para download */}
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = file.url;
                a.download = file.name; // Define o nome do arquivo a ser baixado
                a.target = "_blank"; // Abre em nova aba
                document.body.appendChild(a); // Adiciona o link ao DOM
                a.click(); // Força o clique
                document.body.removeChild(a); // Remove o link após o clique
              }}
              className="file-link"
            >
              {file.name} 📥
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
