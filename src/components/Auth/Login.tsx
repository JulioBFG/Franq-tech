import { Button, TextField } from "@radix-ui/themes";
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

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    const success = login(email, password);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Email ou senha incorretos");
    }
  };

  return (
    <Container>
      <FormCard>
        <Image src={Logo} alt="Logo" />
        <Title>Login</Title>
        {error && <Error>{error}</Error>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <TextField.Root
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Senha</Label>
            <TextField.Root
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <Button type="submit">Entrar</Button>
        </form>
        <StyledLink to="/register">Não tem conta? Cadastre-se</StyledLink>
      </FormCard>
    </Container>
  );
};

export default Login;
