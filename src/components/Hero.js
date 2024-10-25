import styles from './HeroSection.module.css';
import Image from 'next/image';
import myimg from './images/s.png';
import { useRouter } from 'next/router';


export default function HeroSection() {
  const router = useRouter();
  return (
    <section className={styles.heroSection}>
        <div className={styles.heroContent}>
        <h1 style={{ fontWeight: "bold", color:"white" }}>Put Confidentiality on Autopilot!</h1>
          <h3 style={{fontSize:"22px",fontWeight:"bold", color:"#909aeb"}}>Confidentiality as a Service</h3>
            <p style={{color:"white"}}>
              Join the future of decentralized Storage. 
              Store your valuable documents in a safe space
            </p>
            <button className={styles.ctaButton}>
              Get Started
            </button>

        </div>
        <div className={styles.heroImage}>
            <Image
                src={myimg}
                width={300}
                height={300}
                alt='treasure'  
            /> 
       
        </div>
    </section>
  );
}