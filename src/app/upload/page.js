"use client";

import { useState } from "react";
import { storage } from "../../lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import axios from "axios";
import "./upload.css";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controle do carregamento

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor, selecione um arquivo para upload.");
      return;
    }
  
    if (!file.name.endsWith(".wav")) {
      setMessage("Somente arquivos .wav são permitidos.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage("Usuário não autenticado.");
      return;
    }

    setLoading(true); // Ativa o estado de carregamento

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.uid);

      const apiUrl = `https://audio-cleaner-b6b4b5ad8f62.herokuapp.com/process_audio/`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setMessage("Sucesso: " + response.data.message);
      } else {
        setMessage("Erro ao processar arquivo: " + response.data.message);
      }
    } catch (error) {
      console.error("Error details:", error);
      setMessage("Erro ao processar e fazer upload: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <div className="container">
      <h1 className="title">Upload de Arquivos</h1>
      <input type="file" onChange={handleFileChange} className="input-file" />
      <button onClick={handleUpload} className="button" disabled={loading}>
        {loading ? "Processando..." : "Fazer Upload"}
      </button>
      <button onClick={() => window.location.href = "/download"} className="button" disabled={loading}>
        Audios Processados
      </button>
      <button onClick={() => window.location.href = "/dashboard"} className="button" disabled={loading}>
        Dashboard
      </button>
      {loading && (
        <div className="loading">
          <img src="/loading.gif" alt="Carregando..." className="loading-gif" />
        </div>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}
