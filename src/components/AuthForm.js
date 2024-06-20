

import React, { useState } from "react";
import styled from "styled-components";


const FormContainer = styled.form`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;


const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${props => props.primary ? '#4caf50' : '#2196f3'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const AuthForm = ({ isLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
        console.log('Logging in:', formData);
        // Replace with actual login logic
        } else {
        console.log('Signing up:', formData);
        // Replace with actual signup logic
        }
        // Reset form fields
        setFormData({
        username: '',
        email: '',
        password: ''
        });
    };
    return (
        <FormContainer onSubmit={handleSubmit}>
            <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
            {!isLogin && (
                <InputField
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                />
            )}
            <InputField
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <InputField
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />
            <SubmitButton primary type="submit">{isLogin ? 'Log In' : 'Sign Up'}</SubmitButton>
            <SubmitButton type="button" onClick={() => setFormData({ username: '', email: '', password: '' })}>
                Clear
            </SubmitButton>
            <p>{isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => setIsLogin(prevState => !prevState)}>
                {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </FormContainer>
    );
};

export default AuthForm;