
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

import { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { FaUpload } from 'react-icons/fa';
import styles from '../components/DocumentItem.module.css';

import { ContractKitProvider, ContractKit } from '@celo/contractkit';
//import '@celo-tools/use-contractkit/lib/styles.css';

import { contractAddress, cUSDContractAddress } from '../utils/constants';
import { SocketAddress } from "net";

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
  color: #333;
`;

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

const WalletButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #0070f3;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-top:20px;
  align-self:center;
  margin-left:700px;
  margin-top:400px;
  width:200px;
  &:hover {
    background-color: #005bb5;
  }
`;

const RetrieveButton = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #0070f3;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  margin-top:20px;
  margin-left:120px;
  background-color:green;
  border-radius:12px;
  &:hover {
    background-color: #8a9a5b;
  }
`;


const DocumentListContainer = styled.div`
  width: 100%;
`;

const DocumentItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #ffffff;
`;

const Documents = () => {
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [newTrustee, setNewTrustee] = useState('');
  const [message, setMessage] = useState('');

  const [kit, setKit] = useState(null);
  const [docs, setDocs] = useState(false);

  const [address, setAddress] = useState(null);

  
  
  // const cUSDContractAddress = cUSDContractAddress;// cUSD contract address on Celo mainnet

  const DocumentItem = ({ name, addTrustee }) => {
    return (
      <div style={styles.documentItem}>
        <h2 style={styles.myContent}>{name}</h2>
        <h3>Trustees</h3>
      </div>
    );
  };


  useEffect(() => {
    const storedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(storedDocuments);

    const init = async () => {
      if (window.celo) {
        const web3 = new Web3(window.celo);
        const kit = newKitFromWeb3(web3);
        setKit(kit);

        await window.celo.enable();
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        // window.celo.on('accountsChanged', (accounts) => {
        //   setAccount(accounts[0] || null);
        // });
      } else {
        alert('Celo extension not found. Please install it.');
      }
    };

    init();
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
    try {
      const added = await ipfs.add(file);
      const ipfsHash = added.path;

      const newDocument = { id: Date.now(), ipfsHash, trustees: [] };
      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      setMessage('Document uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      setMessage('Error uploading document');
    }
  };

  //==just mae a fake upload===
  const loadDocs = (e) => {
    setDocs(true);
    e.preventDefault();
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadClick = async (e) => {
    e.preventDefault();
    if (file) {
      await uploadDocument();
    } else {
      alert('Please select a file to upload');
    }
  };

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

  //retrieve the document
  const retrieveDocument = async (e) => {
    e.preventDefault();

    const amountInUSD = 20; // Amount in USD
    const exchangeRate = 1; // Placeholder exchange rate, replace with actual rate
    const amountInCELO = Web3.utils.toWei((amountInUSD / exchangeRate).toString(), 'ether');

    if (!address) {
      alert('Please connect wallet first');
      return;
    }

    try {
      //==some changes====
      const cUSDContract = new kit.web3.eth.Contract(
        [
          {
            constant: false,
            inputs: [
              { name: '_to', type: 'address' },
              { name: '_value', type: 'uint256' }
            ],
            name: 'transfer',
            outputs: [{ name: '', type: 'bool' }],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        cUSDContractAddress
      );
      
      const tx = await cUSDContract.methods
        .transfer(cUSDContractAddress, amountInCELO)
        .send({ from: address });
      
      await tx.waitReceipt();
      alert('payment successful, retrieving document...')
      //logic to retrieve and show the document
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment');
    }

  }
  return (
    <>
      {!account ? (
        <WalletButton onClick={connectWallet}>Connect Wallet</WalletButton>
      ) : (
        <Layout>
          <Container>
            <UploadForm>
              <Title>Upload Document</Title>
              <Input type="file" onChange={handleFileChange} />
              <Button
                onClick={
                  loadDocs
                }
              >
                <FaUpload /> Upload
              </Button>
              {message && <p>{message}</p>}
            </UploadForm>

            <DocumentListContainer>
              <h1 style={{ fontSize: "23px", fontWeight: "bold", marginTop: "15px", marginLeft: "30px" }}>Your Documents</h1>
              {
                docs ? (
                  <div style={{ alignItems: "center", justifyContent: "center" }}>
                    <RetrieveButton onClick={retrieveDocument}>
                      Retrieve Document
                    </RetrieveButton>
                    {/* <button style={{height:"20px", width:"100px"}}>
                        <h3>Retrieve Document</h3>
                      </button> */}
                  </div>
                ) : (
                  <h3 style={{ fontSize: "20px", textAlign: "center", marginTop: "23px" }}>No documents</h3>
                )
              }
              
            </DocumentListContainer>
          </Container>
        </Layout>
      )}
    </>
   
  );
};

export default Documents;
