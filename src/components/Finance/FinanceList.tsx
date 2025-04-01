import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useFinanceStore } from "../../store/financeStore";
import EmptyState from "../UI/EmptyState";
import LoadingSpinner from "../UI/Spinner";
import FinanceItem from "./FinanceItem";

const FinanceList = () => {
  const items = useFinanceStore((state) => state.items);
  const selectedItem = useFinanceStore((state) => state.selectedItem);
  const selectItem = useFinanceStore((state) => state.selectItem);
  const loading = useFinanceStore((state) => state.loading);
  const error = useFinanceStore((state) => state.error);
  const fetchData = useFinanceStore((state) => state.fetchData);

  return (
    <Card size="2" style={{ height: "100%" }}>
      <Box p="3">
        <Heading size="3" mb="2">
          Cotações
        </Heading>

        {error && (
          <Box
            mb="3"
            p="2"
            style={{
              backgroundColor: "#fee2e2",
              borderRadius: "4px",
            }}>
            <Text size="1" color="red">
              {error}
            </Text>
          </Box>
        )}

        {loading && items.length === 0 && (
          <Box p="6">
            <LoadingSpinner text="Carregando cotações..." />
          </Box>
        )}

        {!loading && items.length === 0 && (
          <EmptyState
            icon="📊"
            title="Sem cotações disponíveis"
            description="Não foi possível carregar os dados financeiros."
            action={
              <Flex justify="center">
                <button
                  onClick={() => fetchData()}
                  style={{
                    backgroundColor: "#3861fb",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}>
                  Tentar novamente
                </button>
              </Flex>
            }
          />
        )}

        {/* Lista de itens */}
        {items.length > 0 && (
          <Box style={{ maxHeight: "500px", overflowY: "auto" }}>
            {items.map((item) => (
              <FinanceItem
                key={item.id}
                item={item}
                isSelected={selectedItem?.id === item.id}
                onClick={() => selectItem(item.id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default FinanceList;
