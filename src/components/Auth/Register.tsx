import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const success = register(name, email, password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Este email já está em uso.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar registrar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "100vh",
        padding: "16px",
      }}>
      <Box style={{ width: "100%", maxWidth: "400px" }}>
        <Card>
          <Box p="4">
            <Heading size="5" mb="4" align="center">
              Cadastro
            </Heading>

            {error && (
              <Box
                mb="3"
                p="2"
                style={{ backgroundColor: "#fee2e2", borderRadius: "4px" }}>
                <Text size="2" color="red">
                  {error}
                </Text>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <Box mb="3">
                <Text size="2" mb="1" weight="medium">
                  Nome
                </Text>
                <TextField.Root
                  size="2"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Box>

              <Box mb="3">
                <Text size="2" mb="1" weight="medium">
                  Email
                </Text>
                <TextField.Root
                  size="2"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </Box>

              <Box mb="3">
                <Text size="2" mb="1" weight="medium">
                  Senha
                </Text>
                <TextField.Root
                  size="2"
                  placeholder="Crie uma senha segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </Box>

              <Box mb="4">
                <Text size="2" mb="1" weight="medium">
                  Confirmar Senha
                </Text>
                <TextField.Root
                  size="2"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required
                />
              </Box>

              <Button
                type="submit"
                size="2"
                disabled={loading}
                style={{ width: "100%" }}>
                {loading ? "Processando..." : "Cadastrar"}
              </Button>
            </form>

            <Box mt="4">
              <Text size="2">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  style={{ color: "#3861fb", textDecoration: "none" }}>
                  Faça login
                </Link>
              </Text>
            </Box>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
};

export default Register;
