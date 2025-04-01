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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const success = login(email, password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Email ou senha incorretos.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login.");
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
              Login
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

              <Box mb="4">
                <Text size="2" mb="1" weight="medium">
                  Senha
                </Text>
                <TextField.Root
                  size="2"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </Box>

              <Button
                type="submit"
                size="2"
                disabled={loading}
                style={{ width: "100%" }}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <Box mt="4">
              <Text size="2">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  style={{ color: "#3861fb", textDecoration: "none" }}>
                  Cadastre-se
                </Link>
              </Text>
            </Box>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
};

export default Login;
