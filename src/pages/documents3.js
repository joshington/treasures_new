// pages/documents.js
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';

const DocumentListContainer = styled.div`
  padding: 2rem;
`;

const DocumentItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #ffffff;
`;

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #0070f3;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [newTrustee, setNewTrustee] = useState('');

  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(storedDocuments);
  }, []);

  const addTrustee = (docId) => {
    const updatedDocuments = documents.map((doc) => {
      if (doc.id === docId) {
        return { ...doc, trustees: [...doc.trustees, newTrustee] };
      }
      return doc;
    });
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    setNewTrustee('');
  };

  return (
    <Layout>
      <h1>Your Documents</h1>
      <DocumentListContainer>
        {documents.map((doc) => (
          <DocumentItem key={doc.id}>
            <p>IPFS Hash: <a href={`https://ipfs.infura.io/ipfs/${doc.ipfsHash}`} target="_blank" rel="noopener noreferrer">{doc.ipfsHash}</a></p>
            <h3>Trustees</h3>
            <ul>
              {doc.trustees.map((trustee, index) => (
                <li key={index}>{trustee}</li>
              ))}
            </ul>
            <Input 
              type="text" 
              value={newTrustee} 
              onChange={(e) => setNewTrustee(e.target.value)} 
              placeholder="Enter trustee address"
            />
            <Button onClick={() => addTrustee(doc.id)}>Add Trustee</Button>
          </DocumentItem>
        ))}
      </DocumentListContainer>
    </Layout>
  );
};

export default Documents;
