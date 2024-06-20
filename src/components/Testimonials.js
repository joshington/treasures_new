import styles from './testimonial.module.css';

export default function Testimonials() {
    const testimonials = [
        {
        name: "John Doe",
        title: "CEO, Company One",
        image: "/images/testimonial1.jpg",
        quote: "Diwala has revolutionized our credentialing process. It's fast, secure, and reliable."
        },
        {
        name: "Jane Smith",
        title: "CTO, Company Two",
        image: "/images/testimonial2.jpg",
        quote: "We trust Diwala for all our digital credentialing needs. Their platform is top-notch."
        },
        {
        name: "Alice Johnson",
        title: "HR Manager, Company Three",
        image: "/images/testimonial3.jpg",
        quote: "Diwala's platform is user-friendly and efficient. We highly recommend it."
        }
    ];
    return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.title}>Client Testimonials</h2>
      <div className={styles.testimonials}>
        {testimonials.map((testimonial, index) => (
          <div className={styles.testimonial} key={index}>
            <img src={testimonial.image} alt={testimonial.name} className={styles.image} />
            <p className={styles.quote}>"{testimonial.quote}"</p>
            <p className={styles.name}>{testimonial.name}</p>
            <p className={styles.title1}>{testimonial.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}