
import { useState } from 'react';
import DocumentItem from './DocumentItem';
import styles from './DocumentList.module.css';


const initialDocuments = [
  { id: 1, content: "Document 1 ", trustees: [] },

];

const DocumentList = () => {
  const [documents, setDocuments] = useState(initialDocuments);

  const addTrustee = (docId, trustee) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, trustees: [...doc.trustees, trustee] } : doc
    ));
  };

  return (
    <div className={styles.documentList}>
      {documents.map(doc => (
        <DocumentItem key={doc.id} document={doc} addTrustee={addTrustee} />
      ))}
    </div>
  );
};

export default DocumentList;
