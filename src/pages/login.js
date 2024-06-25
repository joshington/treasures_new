

import styled from 'styled-components';
import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/router';
import PasswordInput from '@/components/PasswordInput'; 


const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
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

  margin-top:20px;


  &:hover {
    background-color: #005bb5;
  }
`;

const LinkContainer = styled.div`
  margin-top: 1rem;
  font-size:1.2rem;
  font-weight:bold;
  text-align: center;
`;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const router = useRouter();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ email, password });
        router.push('/upload');
    };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Treasures - Login</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
                  //   onChange={(e) => setEmail(e.target.value)}
            onChange={handleEmailChange}
          required
        />
        {/* <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> */}
        <PasswordInput 
            label="Password"
            value={password}
            onChange={handlePasswordChange}      
        />
        <Button type="submit">Login</Button>
      </LoginForm>
      <LinkContainer>
        <Link href="/signup">Don't have an account? Sign Up</Link>
      </LinkContainer>
    </LoginContainer>
  );
}