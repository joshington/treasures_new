import styles from './HeroSection.module.css';
import Image from 'next/image';
import myimg from './images/treasure.png';
import { useRouter } from 'next/router';


export default function HeroSection() {
  const router = useRouter();
  return (
    <section className={styles.heroSection}>
        <div className={styles.heroContent}>
            <h1>Put Trust on Autopilot!</h1>
            <p>Join the future of digital credentialing. Create, seal, and issue thousands of tamper-proof credentials and IDs in 3 simple steps.</p>
            <button className={styles.ctaButton} onClick={() => router.push('/login')}>
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