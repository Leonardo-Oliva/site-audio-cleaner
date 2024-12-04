"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import "../app/upload/upload.css";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controle do carregamento
  const [filters, setFilters] = useState({
    apply_noise_gate: false,
    apply_compressor: false,
    apply_low_shelf_filter: false,
    apply_gain: false,
    apply_reverb: false,
    apply_chorus: false,
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
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

    // Verificando se pelo menos um filtro foi selecionado
    const isAnyFilterSelected = Object.values(filters).includes(true);
    if (!isAnyFilterSelected) {
      setMessage("Por favor, marque pelo menos um filtro.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage("Usuário não autenticado.");
      return;
    }

    setLoading(true); // Ativa o estado de carregamento

    const startTime = Date.now(); // Início do processamento

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.uid);

      // Adicionando os filtros ao FormData
      Object.keys(filters).forEach((filter) => {
        formData.append(filter, filters[filter]);
      });

      const apiUrl = `https://audio-cleaner-b6b4b5ad8f62.herokuapp.com/process_audio/`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const endTime = Date.now(); // Fim do processamento
      const processingTime = (endTime - startTime) / 1000; // Tempo de processamento em segundos

      if (response.status === 200) {
        setMessage("Sucesso: " + response.data.message);

        // Salvar dados no Firestore
        await addDoc(collection(db, "uploads"), {
          user_id: user.uid,
          file_name: file.name,
          filters_used: filters,
          processing_time: processingTime,
          timestamp: new Date(),
        });

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
      
      {/* Checkboxes para os filtros */}
      <div className="checkbox-group">
        {Object.keys(filters).map((filter) => {
          let title = "";
          switch (filter) {
            case "apply_noise_gate":
              title = "Função: Reduz ou elimina o som abaixo de um certo nível (threshold), conhecido como 'ruído de fundo'.";
              break;
            case "apply_compressor":
              title = "Função: Reduz a diferença entre as partes mais altas e mais baixas do áudio, tornando o som mais uniforme.";
              break;
            case "apply_low_shelf_filter":
              title = "Função: Amplia as frequências baixas (graves) abaixo de um certo ponto.";
              break;
            case "apply_gain":
              title = "Função: Amplia o volume geral do áudio.";
              break;
            case "apply_chorus":
              title = "Função: Duplica o som original com pequenas variações de tempo e afinação, criando a sensação de múltiplas fontes tocando juntas, como um coro ou várias guitarras.";
              break;
            case "apply_reverb":
              title = "Função: Simula o som refletindo em diferentes superfícies, adicionando um 'eco' natural e criando a sensação de ambiente ou espaço (como uma sala ou catedral).";
              break;
          }

          return (
            <label key={filter} className="checkbox-label" title={title}>
              <input
                type="checkbox"
                name={filter}
                checked={filters[filter]}
                onChange={handleFilterChange}
              />
              {filter.replace("apply_", "").replace("_", " ").toUpperCase()}
            </label>
          );
        })}
      </div>
      <h1 className="explicacao">Passe o mouse por cima das opções para mais detalhes sobre a função dos efeitos.</h1>

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
