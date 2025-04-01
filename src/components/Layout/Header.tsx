import { Button } from "@radix-ui/themes";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../../hooks/useAuth";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 16px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <UserInfo>
        <span>Olá, {user?.name}</span>
        <Button onClick={handleLogout}>Sair</Button>
      </UserInfo>
    </HeaderContainer>
  );
};

export default Header;
