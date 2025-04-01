import { Box, Flex, Text } from "@radix-ui/themes";
import { FinanceItem as FinanceItemType } from "../../types/finances";

interface FinanceItemProps {
  item: FinanceItemType;
  isSelected: boolean;
  onClick: () => void;
}

const FinanceItem = ({ item, isSelected, onClick }: FinanceItemProps) => {
  const { name, price, variation } = item;
  const isPositive = variation >= 0;

  const formattedPrice = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedVariation = `${
    isPositive ? "+" : ""
  }${variation.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;

  return (
    <Box
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderRadius: "4px",
        backgroundColor: isSelected ? "#f0f7ff" : "white",
        borderLeft: `4px solid ${isSelected ? "#3861fb" : "transparent"}`,
        marginBottom: "8px",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
      }}>
      <Flex justify="between" align="center">
        <Box>
          <Text size="2" weight={isSelected ? "medium" : "regular"}>
            {name}
          </Text>
          {item.symbol && (
            <Text size="1" color="gray">
              {item.symbol}
            </Text>
          )}
        </Box>

        <Flex direction="column" align="end">
          <Text size="2" weight="medium">
            {formattedPrice}
          </Text>
          <Text
            size="1"
            style={{
              color: isPositive ? "#10b981" : "#ef4444",
              fontWeight: "500",
            }}>
            {formattedVariation}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default FinanceItem;
