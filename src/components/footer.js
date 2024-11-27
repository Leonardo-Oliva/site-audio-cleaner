// components/Footer.js
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2024 Audio Cleaner</p>
      <div className={styles.links}>
        <a href="https://www.linkedin.com/in/leonardo-oliva-neves-795720247/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href="https://github.com/Leonardo-Oliva" target="_blank" rel="noopener noreferrer">
          Github
        </a>
      </div>
    </footer>
  );
}
