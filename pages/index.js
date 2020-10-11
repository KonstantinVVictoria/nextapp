import styles from "../styles/Home.module.css";
import LoadCS from "../components/LoadCS";
import SFX from "../components/sfx";
export default function Home() {
  let Console = LoadCS("console");
  return (
    <div className={styles.container}>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          maxheight: 100%;
          height: 100vh;
          width: 100%;
        }

        #__next {
          maxheight: 100vh;
          height: 100%;
          width: 100%;
        }
      `}</style>
      <SFX />
      <Console />
    </div>
  );
}
