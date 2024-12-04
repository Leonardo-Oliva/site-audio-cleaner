"use client";

import { useState, useEffect } from "react";
import { storage } from "../lib/firebase";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../app/download/downloadPage.css";

export default function DownloadPage() {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Estado para armazenar o usuário autenticado

  // Função recursiva para listar arquivos e subpastas
  const fetchFolderFiles = async (folderRef, basePath = "") => {
    const folderContents = await listAll(folderRef);
    const filesByFolder = {};

    // Adicionar arquivos encontrados na pasta atual
    for (const itemRef of folderContents.items) {
      const url = await getDownloadURL(itemRef);
      const relativePath = basePath || "root"; // Define o nome da pasta ou "root" se estiver na raiz

      if (!filesByFolder[relativePath]) {
        filesByFolder[relativePath] = [];
      }
      filesByFolder[relativePath].push({ name: itemRef.name, url, ref: itemRef });
    }

    // Repetir o processo para subpastas
    for (const folder of folderContents.prefixes) {
      const subFolderFiles = await fetchFolderFiles(folder, `${basePath}/${folder.name}`);
      Object.assign(filesByFolder, subFolderFiles); // Combinar resultados de subpastas
    }

    return filesByFolder;
  };

  // Função para excluir a pasta e seus arquivos
  const deleteFolder = async (folderRef, folderName) => {
    const folderContents = await listAll(folderRef);

    // Excluir os arquivos dentro da pasta
    for (const itemRef of folderContents.items) {
      await deleteObject(itemRef);
    }

    // Excluir a pasta após os arquivos
    console.log(`Pasta ${folderName} deletada com sucesso.`);
    setFiles(prevFiles => {
      const updatedFiles = { ...prevFiles };
      delete updatedFiles[folderName]; // Remove a pasta da lista
      return updatedFiles;
    });
  };

  useEffect(() => {
    const fetchFiles = async (user) => {
      const folderRef = ref(storage, `${user.uid}`);
      try {
        const filesByFolder = await fetchFolderFiles(folderRef);
        setFiles(filesByFolder);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao listar arquivos:", err);
        setError("Erro ao listar arquivos.");
        setLoading(false);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Atualiza o estado do usuário
        fetchFiles(user);
      } else {
        setError("Usuário não autenticado.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="download-container">
      <h1 className="titulo">Audios Processados</h1>
      {/* Linha separadora entre título e arquivos */}
      <hr className="title-separator" />
      {loading && <p>Carregando arquivos...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div>
          {Object.keys(files).map((folderName) => {
            // Extraindo os efeitos do nome da pasta (antes do "+")
            const effects = folderName.split("+")[0].split("-").map(effect => effect.charAt(0).toUpperCase() + effect.slice(1)).join(", ");

            return (
              <div key={folderName} className="folder">
                <p>
                  <strong className="nome-arquivo">
                    {folderName === "root" ? "Raiz" : folderName.split("+")[1]}:
                  </strong>
                  {/* Exibindo os efeitos ao lado do nome da pasta */}
                  <span className="effects">{effects && `Efeitos utilizados: ${effects.replace("_", " ").replace("/", "")}`}</span>
                </p>
                <div className="file-list">
                  {files[folderName].map((file) => (
                    <div key={file.name} className="file-item">
                      {/* Exibe Alterado ou Original fora do botão */}
                      {file.name.includes("_enhanced") ? "Alterado: " : "Original: "}
                      <button
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = file.url;
                          a.download = file.name;
                          a.target = "_blank";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                        className="file-link"
                      >
                        {file.name} 📥
                      </button>
                    </div>
                  ))}
                </div>
                {/* Botão para apagar a pasta com confirmação */}
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm("Tem certeza que deseja apagar estes audios?");
                    if (confirmDelete && user) {
                      const folderRef = ref(storage, `${user.uid}/${folderName}`); // Caminho atualizado
                      deleteFolder(folderRef, folderName);
                    }
                  }}
                  className="delete-folder-button"
                >
                  Apagar Audio
                </button>
                <h1 className="data">Audio enviado em: {folderName.split("+")[2].replace("=", "/").replace("=", "/")}</h1>
                {/* Linha separadora entre cada grupo de arquivos */}
                <hr className="folder-separator" />
              </div>
            );
          })}
        </div>
      )}
      <button onClick={() => window.location.href = "/dashboard"} className="button" disabled={loading}>
        Dashboard
      </button>
    </div>
  );
}
