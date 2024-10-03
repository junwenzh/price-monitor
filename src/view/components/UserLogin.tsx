import React from 'react';
import { LoginForm } from './LoginForm';
import Container from './ui/container';

export default function Login() {
  return (
    <Container>
      <h2 className="text-2xl mb-10">Log Into Your Account!</h2>
      <LoginForm />
    </Container>
  );
}
