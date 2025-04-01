// src/components/Header.tsx
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      style={{
        backgroundColor: "white",
        padding: "16px 24px",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}>
      <Flex justify="between" align="center">
        <Heading size="5" style={{ color: "#3861fb" }}>
          Finance App
        </Heading>

        <Flex align="center" gap="4">
          <Box>
            <Text size="2" weight="medium">
              Olá, {user?.name}
            </Text>
          </Box>

          <Button size="2" variant="soft" onClick={handleLogout}>
            Sair
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
