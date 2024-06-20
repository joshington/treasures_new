
// pages/upload.js
import { FaUpload } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setMessage('');
      setProgress(0);

      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentage);
        },
      });

      setIpfsUrl(response.data.url);
      setMessage('File uploaded successfully.');
    } catch (error) {
      setMessage('Failed to upload file.');
    }
  };

  return (
    <UploadContainer>
      <UploadForm onSubmit={handleSubmit}>
        <Title>Upload Document</Title>
        <Input type="file" onChange={handleFileChange} />
        <Button type="submit">
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
    </UploadContainer>
  );
}