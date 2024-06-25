

import { useState } from 'react';
import AddTrusteeForm from './AddTrusteeForm';
import styles from './DocumentItem.module.css';


const DocumentItem = ({ name, addTrustee }) => {
  return (
    <div style={styles.documentItem}>
      <h2 style={styles.myContent}>{name}</h2>
      <h3>Trustees</h3>
    </div>
  );
};

export default DocumentItem;