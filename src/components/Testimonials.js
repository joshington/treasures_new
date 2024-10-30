import styles from './testimonial.module.css';

export default function Testimonials() {
    const testimonials = [
        {
        name: "Jovan Mwesigwa",
        title: "Oneramp Founder",
        // image: "/images/testimonial1.jpg",
        quote: "To the SMEs in Uganda, this technology will allow agility, trust, scale and much more, contribute to saving the environment."
        },
        {
        name: "Kiyingi Raymond",
        title: "RealEstate Entrepreeur",
        // image: "/images/testimonial2.jpg",
        quote: "I believe Treasures will help curb counterfeit issues regarding land titles"
        },
        {
        name: "Maria",
        title: "Parent",
        // image: "/images/testimonial3.jpg",
        quote: "I honestly believe treasures will revolutionalize digital crendentialing,In academic institutions"
        }
    ];
    return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.title}>Client Prospects</h2>
      <div className={styles.testimonials}>
        {testimonials.map((testimonial, index) => (
          <div className={styles.testimonial} key={index}>
            {/* <img src={testimonial.image} alt={testimonial.name} className={styles.image} /> */}
            <p className={styles.quote}>"{testimonial.quote}"</p>
            <p className={styles.name}>{testimonial.name}</p>
            <p className={styles.title1}>{testimonial.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}