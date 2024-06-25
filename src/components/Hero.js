import styles from './HeroSection.module.css';
import Image from 'next/image';
import myimg from './images/treasure.png';
import { useRouter } from 'next/router';


export default function HeroSection() {
  const router = useRouter();
  return (
    <section className={styles.heroSection}>
        <div className={styles.heroContent}>
        <h1 style={{ fontWeight: "bold" }}>Put Confidentiality on Autopilot!</h1>
          <h3 style={{fontSize:"22px",fontWeight:"bold"}}>Confidentiality as a Service</h3>
            <p>Join the future of decentralized Storage. Store your valuable documents in a safe space</p>
            <button className={styles.ctaButton} onClick={() => router.push('/upload')}>
              Get Started
            </button>

        </div>
        <div className={styles.heroImage}>
            <Image
                src={myimg}
                width={700}
                height={500}
                alt='treasure'  
            /> 
       
        </div>
    </section>
  );
}