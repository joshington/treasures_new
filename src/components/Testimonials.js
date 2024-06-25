import styles from './testimonial.module.css';

export default function Testimonials() {
    const testimonials = [
        {
        name: "John Doe",
        title: "CEO, Company One",
        // image: "/images/testimonial1.jpg",
        quote: "Treasures has revolutionized our storage "
        },
        {
        name: "Jane Smith",
        title: "Elder",
        // image: "/images/testimonial2.jpg",
        quote: "Treasures has enabled me store my landtitles"
        },
        {
        name: "Joseph",
        title: "Young Adult",
        // image: "/images/testimonial3.jpg",
        quote: "Through treasures i can store my Education credentials"
        }
    ];
    return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.title}>Client Testimonials</h2>
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