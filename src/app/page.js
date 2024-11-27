// app/home/page.js
"use client";

import Link from "next/link";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.siteName}>Audio Cleaner</h1>
        <div className={styles.buttons}>
          <Link href="/login">
            <button className={styles.button}>Login</button>
          </Link>
          <Link href="/register">
            <button className={styles.button}>Registrar</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
