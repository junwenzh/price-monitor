import React from 'react';
import SignUpForm from './SignUpForm';
import Container from './ui/container';

export default function Register() {
  return (
    <Container>
      <h2 className="text-2xl mb-10">Sign Up For An Account!</h2>
      <SignUpForm />
    </Container>
  );
}
