
// pages/upload.js
import { FaUpload } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import axios from 'axios';
import styled from 'styled-components';

import contractAbi from "../../contracts/DocStorage.abi.json";
import { contractAddress } from '@/utils/constants';
import { useRouter } from 'next/router';
import { uploadDocument } from '@/utils/contract';


const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
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

const ProgressBar = styled.div`
  width: 100%;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const Progress = styled.div`
  width: ${props => props.percentage}%;
  background-color: #0070f3;
  height: 20px;
  transition: width 0.2s;
`;

const Message = styled.p`
  margin-top: 1rem;
  color: ${props => (props.error ? 'red' : 'green')};
`;

const IPFSLink = styled.a`
  color: #0070f3;
  margin-top: 1rem;
  display: block;
  text-align: center;
`;


export default function Upload() {
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');

  useEffect(() => {
    if (window.celo) {
      window.celo.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);


  const router = useRouter();
  const connectWallet = async () => {
    try {
      if (!window.celo) {
        alert("celo extension not found. please install it");
        return 
      }
      await window.celo.enable();
      const accounts = await window.celo.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet");
    }
  }


  //===mthod to handle uploading the document===
  const uplaodDocument = async () => {
    if (!file) {
      alert("please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    if (!window.celo) {
      alert("celo extension wallet not found. Please install it.");
      return;
    }
    try {
      //upload tthe file to IPFS
      console.log('....uploading now....')
      const added = await ipfs.add(file);
      const ipfsHash = added.path;

      //create a new worker for compiling the Wasm module===
      //const worker = new Worker(new URL('../../public/wasmWorker.js', import.meta.url));
      //const worker = new Worker();
      //worker.postMessage(await file.arrayBuffer()); //asuming file contains the Wasm binary

      const workerBlob = new Blob([
        `
          self.onmessage = async (event) => {
            try {
              const wasmCode = new Uint8Array(event.data);
              const module = await WebAssembly.compile(wasmCode);
              self.postMessage({ module });
            } catch (error) {
              console.error('Compilation failed in worker:', error);
              self.postMessage({ error: error.message });
            }
          };
        `
      ], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(workerBlob));

      worker.postMessage(await file.arrayBuffer()); // Assuming `file` contains the Wasm binary

      worker.onmessage = async (event) => {
        if (event.data.error) {
          setMessage(`Error: ${event.data.error}`);
          return;
        }

        //const { module } = event.data;

        const provider = new ethers.providers.Web3Provider(window.celo);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const tx = await contract.uploadDocument(ipfsHash, { value: ethers.utils.parseEther("0.01") });
        // Ensure to provide the correct value if needed
        await tx.wait();
      
        
        setMessage("Document uploaded successfully!");
        router.push('/documents');
      }
      
      worker.onerror = (workerError) => {
        console.error("Worker error:", workerError);
        setMessage("Error uploading document");
      };
       //redirect to see the documents of the user.
    } catch (error) {
      console.error("Error uploading document:", error);
      setMessage("Error uploading document");
    } 
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!file) {
  //     setMessage('Please select a file to upload.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     setMessage('');
  //     setProgress(0);

  //     const response = await axios.post('/api/upload', formData, {
  //       onUploadProgress: (progressEvent) => {
  //         const percentage = Math.round(
  //           (progressEvent.loaded * 100) / progressEvent.total
  //         );
  //         setProgress(percentage);
  //       },
  //     });

  //     setIpfsUrl(response.data.url);
  //     setMessage('File uploaded successfully.');
  //   } catch (error) {
  //     setMessage('Failed to upload file.');
  //   }
  // };

  return (
    <UploadContainer>
      {!account ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
      ): (
          <div>
            <p>Connected wallet: {account}</p>
            <UploadForm>
                <Title>Upload Document</Title>
                <Input type="file" onChange={handleFileChange} />
                <Button type="submit" onClick={() => uploadDocument()}>
                    <FaUpload />  Upload
                </Button>
                {progress > 0 && (
                  <ProgressBar>
                    <Progress percentage={progress} />
                  </ProgressBar>
                )}
                {message && <Message error={message.includes('Failed')}>{message}</Message>}
                {ipfsUrl && (
                  <IPFSLink href={ipfsUrl} target="_blank" rel="noopener noreferrer">
                    View Uploaded Document
                  </IPFSLink>
                )}
            </UploadForm>
          </div>
      )}
      
    </UploadContainer>
  );
}