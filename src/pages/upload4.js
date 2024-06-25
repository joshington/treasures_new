// pages/upload.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';


const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
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

const Upload = () => {
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (window.celo) {
      window.celo.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.celo) {
        alert('Celo extension not found. Please install it.');
        return;
      }
      await window.celo.enable();
      const accounts = await window.celo.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet');
    }
  };

  const uploadDocument = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      const added = await ipfs.add(file);
      const ipfsHash = added.path;

      console.log('=====doc added successfully=====')
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      documents.push({ id: Date.now(), ipfsHash, trustees: [] });
      localStorage.setItem('documents', JSON.stringify(documents));

      setMessage('Document uploaded successfully!');
      router.push('/documents');
    } catch (error) {
      console.error('Error uploading document:', error);
        setMessage('Error uploading document');
          router.push('/documents');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Layout>
      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div className='uploadCont'>
          <p>Connected wallet: {account}</p>
          <h2>Upload Document</h2>
          <Input type="file" onChange={handleFileChange} />
          <Button onClick={uploadDocument}>Upload</Button>
          {message && <p>{message}</p>}
        </div>
      )}
    </Layout>
  );
};

export default Upload;