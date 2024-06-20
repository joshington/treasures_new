import React from 'react';
import styles from './contact.module.css';


const ContactSection = () => {
  return (
    <section style={{ backgroundColor: '#DEEFF5', padding: '50px 0' }}>
          <div className={`${styles.container}`}>
        <h2>Contact Us</h2>
        <p>Feel free to reach out to us!</p>
        <form className={`${styles.formie}`}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;