import { Button } from "@radix-ui/themes";
import React from "react";
import styled from "styled-components";
import useFinance from "../../hooks/useFinance";
import Card from "../Finance/FinanceCard";
import Layout from "../Layout/Layout";
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Dashboard: React.FC = () => {
  const { refreshData } = useFinance();

  return (
    <Layout>
      <Button onClick={refreshData} style={{ marginBottom: "16px" }}>
        Atualizar Dados
      </Button>

      <DashboardGrid></DashboardGrid>
      <Card />
    </Layout>
  );
};

export default Dashboard;
