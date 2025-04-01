// src/components/RefreshButton.tsx
import { Button, Flex } from "@radix-ui/themes";
import { useFinanceStore } from "../../store/financeStore";

interface RefreshButtonProps {
  showLastUpdate?: boolean;
}

const RefreshButton = ({ showLastUpdate = true }: RefreshButtonProps) => {
  const loading = useFinanceStore((state) => state.loading);
  const fetchData = useFinanceStore((state) => state.fetchData);

  const items = useFinanceStore((state) => state.items);
  let lastUpdateTime: string | null = null;

  if (items.length > 0 && items[0].history.length > 0) {
    const timestamp = items[0].history[items[0].history.length - 1].timestamp;
    lastUpdateTime = new Date(timestamp).toLocaleTimeString("pt-BR");
  }

  return (
    <Flex justify="between" align="center" mb="4">
      <Button size="2" onClick={() => fetchData()} disabled={loading}>
        {loading ? "Atualizando..." : "🔄 Atualizar Dados"}
      </Button>

      {showLastUpdate && lastUpdateTime && !loading && (
        <span style={{ fontSize: "14px", color: "#64748b" }}>
          Última atualização: {lastUpdateTime}
        </span>
      )}
    </Flex>
  );
};

export default RefreshButton;
