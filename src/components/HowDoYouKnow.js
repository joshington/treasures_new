import styles from './know.module.css';
import { FaBars } from 'react-icons/fa';
import styled from 'styled-components';
import { SiBlockchaindotcom } from "react-icons/si";
import { GrStorage } from "react-icons/gr";
import { FaUserShield } from "react-icons/fa";

const LogoContainer = styled.div`
  height:70px;
  align-items:center;
`;




export default function HowDoYouKnow() {
  return (
    <section className={styles.howSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>How Do You Know?</h2>
        <p className={styles.subtitle}>Ensuring trust and transparency in digital credentials.</p>
        <div className={styles.cards}>
          <div className={styles.card}>
            <LogoContainer>
              <SiBlockchaindotcom />
            </LogoContainer>
         
            {/* <img src="/images/icon1.svg" alt="Icon 1" className={styles.icon} /> */}
            <h3 className={styles.cardTitle}>Blockchain Verification</h3>
            <p className={styles.cardDescription}>Each credential is verified on the blockchain, ensuring it cannot be tampered with.</p>
          </div>
          <div className={styles.card}>
            <GrStorage />
            {/* <img src="/images/icon2.svg" alt="Icon 2" className={styles.icon} /> */}
            <h3 className={styles.cardTitle}>Secure Storage</h3>
            <p className={styles.cardDescription}>Credentials are stored securely and can be easily accessed when needed.</p>
          </div>
          <div className={styles.card}>
            {/* <img src="/images/icon3.svg" alt="Icon 3" className={styles.icon} /> */}
            <FaUserShield />
            <h3 className={styles.cardTitle}>User Control</h3>
            <p className={styles.cardDescription}>Users have complete control over their credentials and can share them as needed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

