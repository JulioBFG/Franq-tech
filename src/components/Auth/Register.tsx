import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../assets/LOGO.svg";
import useAuth from "../../hooks/useAuth";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
`;

const FormCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #6c7cec;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #6c7cec;
  }
`;

const Error = styled.p`
  color: red;
  margin-bottom: 16px;
`;

const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #6c7cec;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const Image = styled.img`
  display: flex;
  margin: auto 30px;
`;

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    const success = register(name, email, password);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Email já cadastrado");
    }
  };

  return (
    <Container>
      <FormCard>
        <Image src={Logo} alt="Logo" />
        <Title>Cadastro</Title>

        {error && <Error>{error}</Error>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <Button type="submit">Cadastrar</Button>
        </form>

        <StyledLink to="/login">Já tem conta? Faça login</StyledLink>
      </FormCard>
    </Container>
  );
};

export default Register;
