import styled from "styled-components";
import { useState } from "react";

import Link from 'next/link';
import { ethers } from 'ethers';
import PasswordInput from '@/components/PasswordInput'; 
import { connectCeloWallet } from "@/utils/connectCelo";
import contractAbi from "../../contracts/DocStorage.abi.json";
import { contractAddress, cUSDContractAddress } from "@/utils/constants";

import { useRouter } from 'next/router';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const SignupForm = styled.form`
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
  font-size: 1.2rem;
  font-weight:bold;
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
  text-align: center;
`;




export default function Signup() {
    const [account, setAccount] = useState(null);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  
    const router = useRouter();
    //==connect the wallet===
    const connectWallet = async () => {
      const account = await connectCeloWallet();
      setAccount(account);
    }
  
  //function to handle signup==
  const signUp = async () => {
    if (!email || !username || !password) {
      alert("please fill in all fields");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.celo);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    try {
      e.preventDefault();
      const tx = await contract.createUser(email, username, password);
      await tx.await();

      console.log("===my user is created=====")



      //send email notification===
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subject: "Welcome to Treasures",
          message: "Your account has been created successfully",
        }),
      });
      console.log("user signup succcess....")
      alert("User created and email sent");
      router.push('/upload');


    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  }
  

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ email, username, password });
    };

    return (
      <SignupContainer>
        {
            !account ? (
              <Button onClick={connectWallet}>Connect Wallet</Button>
          ) : (
              <>
                <p>Connected account: {account}</p>
              <SignupForm onSubmit={signUp}>
                <Title>Treasures -  Sign Up</Title>
          
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    placeholder="Password"
                    onChange={handlePasswordChange}      
                />
                <Button type="submit">Sign Up</Button>
              </SignupForm>
              <LinkContainer>
                <Link href="/login">Already have an account? Login</Link>
                </LinkContainer>
              </>
            )
          }
        </SignupContainer>
    );
}