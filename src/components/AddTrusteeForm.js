

import { useState } from 'react';

import styles from './AddTrusteeForm.module.css';

const AddTrusteeForm = ({ documentId, addTrustee }) => {
  const [trustee, setTrustee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTrustee(documentId, trustee);
    setTrustee('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input 
        type="text" 
        value={trustee} 
        onChange={(e) => setTrustee(e.target.value)} 
        placeholder="Add Trustee"
        required
      />
      <button type="submit">Add Trustee</button>
    </form>
  );
};

export default AddTrusteeForm;
