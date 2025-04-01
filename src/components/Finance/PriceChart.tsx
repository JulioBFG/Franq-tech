import { Box, Card, Heading } from "@radix-ui/themes";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { useFinanceStore } from "../../store/financeStore";
import EmptyState from "../UI/EmptyState";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Box
        style={{
          backgroundColor: "white",
          padding: "8px 12px",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}>
        <div style={{ fontWeight: 500, fontSize: "12px" }}>{label}</div>
        <div style={{ color: "#3861fb", fontWeight: 500, fontSize: "14px" }}>
          {payload[0].value?.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </Box>
    );
  }

  return null;
};

const PriceChart = () => {
  const selectedItem = useFinanceStore((state) => state.selectedItem);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const chartData =
    selectedItem?.history.map((point) => ({
      time: formatDate(point.timestamp),
      price: point.price,
      fullDate: new Date(point.timestamp).toLocaleString("pt-BR"),
    })) || [];

  return (
    <Card size="2" style={{ height: "100%" }}>
      <Box p="3">
        <Heading size="3" mb="2">
          {selectedItem
            ? `Evolução de Preços - ${selectedItem.name}`
            : "Evolução de Preços"}
        </Heading>

        {!selectedItem ? (
          <EmptyState
            icon="📈"
            title="Selecione um item"
            description="Escolha uma cotação da lista para visualizar o gráfico de evolução."
          />
        ) : chartData.length <= 1 ? (
          <EmptyState
            icon="⏳"
            title="Dados insuficientes"
            description="Aguarde mais atualizações horárias para visualizar a evolução de preços."
          />
        ) : (
          <Box style={{ height: "350px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(value) => value.toLocaleString("pt-BR")}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  labelFormatter={(label) => {
                    const item = chartData.find((item) => item.time === label);
                    return item ? item.fullDate : label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3861fb"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#3861fb" }}
                  activeDot={{ r: 5, fill: "#3861fb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default PriceChart;
