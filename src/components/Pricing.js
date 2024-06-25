

import styles from './pricing.module.css';

export default function Pricing() {
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
                <h2 className={styles.title}>Clear and Flexible Pricing</h2>
                <p className={styles.subtitle}>Choose a plan that fits your needs.</p>
                <div className={styles.pricingPlans}>
                    {pricingPlans.map((plan, index) => (
                        <div className={styles.plan} key={index}>
                        <h3 className={styles.planTitle}>{plan.title}</h3>
                        <p className={styles.planPrice}>{plan.price}</p>
                        <ul className={styles.planFeatures}>
                            {plan.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <button className={styles.ctaButton}>Get Started</button>
                        </div>
                    ))}
                </div>
            </div>
            </section>
    );
}

