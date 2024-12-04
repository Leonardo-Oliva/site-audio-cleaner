"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";  // Certifique-se de importar o db corretamente
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from "../app/dashboard/dashboard.module.css";

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [effectsData, setEffectsData] = useState({});
  const [avgProcessingTime, setAvgProcessingTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          router.push("/login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const uploadsRef = collection(db, "uploads");
    const querySnapshot = await getDocs(uploadsRef);

    let effectsCount = {
      apply_noise_gate: 0,
      apply_compressor: 0,
      apply_low_shelf_filter: 0,
      apply_gain: 0,
      apply_reverb: 0,
      apply_chorus: 0,
    };
    let totalTime = 0;
    let totalUploads = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalUploads++;

      // Contabiliza os efeitos
      Object.keys(data.filters_used).forEach((filter) => {
        if (data.filters_used[filter]) {
          effectsCount[filter]++;
        }
      });

      // Soma o tempo de processamento
      totalTime += data.processing_time;
    });

    // Calculando a média de tempo de processamento
    const avgTime = totalUploads > 0 ? totalTime / totalUploads : 0;
    setAvgProcessingTime(avgTime);

    setEffectsData(effectsCount);
  };

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      await auth.signOut();
      router.push("/login");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null;
  }

  // Dados para o gráfico de efeitos mais utilizados
  const effectNames = Object.keys(effectsData);
  const effectValues = Object.values(effectsData);

  // Gráfico para Efeitos mais utilizados
  const effectChartData = {
    labels: effectNames.map((effect) =>
      effect.replace("apply_", "").replace("_", " ").toUpperCase()
    ),
    datasets: [
      {
        label: 'Efeitos Utilizados',
        data: effectValues,
        backgroundColor: '#4e73df',
        borderColor: '#4e73df',
        borderWidth: 1,
      },
    ],
  };

  // Gráfico para o tempo médio de processamento
  const timeChartData = {
    labels: ['Tempo Médio'],
    datasets: [
      {
        label: 'Tempo Médio de Processamento (s)',
        data: [avgProcessingTime],
        backgroundColor: '#1cc88a',
        borderColor: '#1cc88a',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.welcome}>Bem-vindo, {user.email.split("@")[0]}</p>
      <p className={styles.description}>
        Esta aplicação permite que você envie áudios para tratamento, garantindo uma qualidade aprimorada e pronta para uso profissional.
      </p>
      <button className={styles.button} onClick={() => router.push("/download")}>
        Audios Tratados
      </button>
      <button className={styles.button} onClick={() => router.push("/upload")}>
        Enviar áudio para tratamento
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Sair
      </button>

      {/* Gráficos */}
      <div className={styles.chartContainer}>
        <h2 className={styles.titleGraph}>Efeitos Mais Utilizados</h2>
        <Bar data={effectChartData} options={{ responsive: true }}/>

        <h2 className={styles.titleGraph}>Tempo Médio de Processamento em Segundos</h2>
        <Bar data={timeChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
