import { Box, Grid } from "@radix-ui/themes";
import { useEffect } from "react";
import { startFinanceUpdates, useFinanceStore } from "../store/financeStore";
import FinanceList from "./Finance/FinanceList";
import PriceChart from "./Finance/PriceChart";
import Header from "./Layout/Header";
import RefreshButton from "./UI/RefreshButton";

const Dashboard = () => {
  const fetchData = useFinanceStore((state) => state.fetchData);

  useEffect(() => {
    const items = useFinanceStore.getState().items;

    if (items.length === 0) {
      fetchData();
    }

    const cleanup = startFinanceUpdates();

    return cleanup;
  }, [fetchData]);

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header />
      <Box style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <RefreshButton showLastUpdate />
        <Grid columns={{ initial: "1", md: "3" }} gap="4">
          <Box>
            <FinanceList />
          </Box>
          <Box style={{ gridColumn: "span 2" }}>
            <PriceChart />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
