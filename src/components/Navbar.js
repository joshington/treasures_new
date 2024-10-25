import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';
import Image from 'next/image';
import mylogo from './images/treasures.jpg';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Image
                    priority
                    src={mylogo}
                    //className={utilStyles.borderCircle}
                    height={108}
                    width={108}
                    alt="logo"
                />
            </div>
            <div className={styles.menuIcon} onClick={toggleMenu}>
                <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
            <ul className={isOpen ? `${styles.navMenu} ${styles.active}` : styles.navMenu}>
                <li className={styles.navItem}>
                    <Link href="/" className={styles.navLink}>
                        Home
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/about">
                        About
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/features" className={styles.navLink}>
                        Features
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/pricing"
                        className={styles.navLink}>Pricing
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </li>
            </ul>
        </nav>
    )
}