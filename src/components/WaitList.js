
import { useState } from 'react';

import styles from './waitlist.module.css';
import Head from 'next/head';

import Image from 'next/image';
import mylogo from './images/newwait.png';
import mylogo1 from './images/treasures.jpg';



export default function WaitList() {

        // These functions can be moved into their own files
    function LeftSide() {
        return (
            <div className={styles.column}>
                {/*
                    <img width="154" height="27" src="/logo.svg"/>
                */}
                
                <h1 className={styles.title}>
                    Receive first hand  <br/>
                    <span className={styles.titleKeyword}>
                        updates
                    </span>
                    {/*
                        https://t.me/treasureswg
                    */}
                    
                </h1>
                <div className={styles.subtitle}>
                    Join Our Telegram working Group
                </div>
                <Form />
            </div>
        )
    }  

    //==form now==
    function Form() {
        const [email, setEmail] = useState("");
        const [hasSubmitted, setHasSubmitted] = useState(false);
        const [error, setError] = useState(null);
    
        const submit = async (e) => {
            // We will submit the form ourselves
            e.preventDefault()
    
            // TODO: make a POST request to our backend
        }
    
        // If the user successfully submitted their email,
        //   display a thank you message
        if (hasSubmitted) {
            return <div className={styles.formWrapper}>
                <span className={styles.subtitle}>
                    Thanks for signing up! We will be in touch soon.
                </span>
                
            </div>
        }
    
        // Otherwise, display the form
        return <form className={styles.formWrapper} onSubmit={submit}>
            {/*
                 <input type="email" required placeholder="Email"
                   className={[styles.formInput, styles.formTextInput].join(" ")}
                   value={email} onChange={e => setEmail(e.target.value)}/>
            */}
           
            <a href='https://t.me/treasureswg'>
                <button type="submit" className={[styles.formInput, styles.formSubmitButton].join(" ")}>
                    Join Waitlist
                </button>
            </a>
            
            
            {error ? <div className={styles.error}>{error}</div> : null}
        </form>
    }

    function RightSide() {
        return (
            <div className={styles.column}>
                <Image
                    priority
                    src={mylogo}
                    //className={utilStyles.borderCircle}
                    height={700}
                    width={400}
                    alt="logo"
                    className="rounded-full aspect-square object-cover"
                    
                />
            </div>
        )
    }

    const pricingPlans = [
        {
        title: "Basic",
        price: "$10/month",
        features: ["2 weeks Free trial", "No trustee", "10 GB storage capacity"]
        },
        {
        title: "Pro",
        price: "$100/annum",
        features: ["2 weeeks Free trial", "3 Trustees", "50 GB Storage"]
        },
        // {
        // title: "Enterprise",
        // price: "Contact Us",
        // features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]
        // }
    ];
    return (
        <section className={styles.pricingSection}>
            <div className={styles.container}>
                <Head>
                    <title>
                    
                        Treasures
                    </title>
                    <meta name="description" content="A quick, scalable waitlist"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <RightSide/>
                <LeftSide/>
                
                {/*
                    <RightSide/>
                */}
                
            </div>
        </section>
    );
}

