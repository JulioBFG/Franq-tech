import { Box, Card, Heading, Text } from "@radix-ui/themes";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { useFinanceStore } from "../../store/financeStore";
import EmptyState from "../UI/EmptyState";

const getChartColor = (variation: number) => {
  return variation >= 0 ? "#10b981" : "#ef4444";
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const initialValue = payload[0]?.payload?.initialPrice || 0;
    const currentValue = payload[0]?.value || 0;
    const isPositive = currentValue >= initialValue;
    const color = isPositive ? "#10b981" : "#ef4444";

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
        <div style={{ fontWeight: 500, fontSize: "14px", color }}>
          {payload[0].value?.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        {initialValue > 0 && (
          <div style={{ fontSize: "12px", color }}>
            {isPositive ? "+" : ""}
            {(((currentValue - initialValue) / initialValue) * 100).toFixed(2)}%
          </div>
        )}
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (
    !selectedItem ||
    !selectedItem.history ||
    selectedItem.history.length <= 1
  ) {
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
          ) : (
            <EmptyState
              icon="⏳"
              title="Dados insuficientes"
              description="Aguarde mais atualizações horárias para visualizar a evolução de preços."
            />
          )}
        </Box>
      </Card>
    );
  }

  const sortedHistory = [...selectedItem.history].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const initialPrice = sortedHistory[0].price;

  let minPrice = Number.MAX_VALUE;
  let maxPrice = 0;

  sortedHistory.forEach((point) => {
    if (point.price < minPrice) minPrice = point.price;
    if (point.price > maxPrice) maxPrice = point.price;
  });

  const yDomainMargin = (maxPrice - minPrice) * 0.1;
  const yMin = Math.max(0, minPrice - yDomainMargin);
  const yMax = maxPrice + yDomainMargin;

  const chartData = sortedHistory.map((point) => ({
    time: formatDate(point.timestamp),
    price: point.price,
    fullDate: new Date(point.timestamp).toLocaleString("pt-BR"),
    initialPrice,
    percentChange: ((point.price - initialPrice) / initialPrice) * 100,
  }));

  const chartColor = getChartColor(selectedItem.variation);

  return (
    <Card size="2" style={{ height: "100%" }}>
      <Box p="3">
        <Heading size="3" mb="2">
          {`Evolução de Preços - ${selectedItem.name}`}
        </Heading>

        <Box style={{ height: "350px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: "#64748b" }}
                angle={-30}
                tickMargin={10}
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => value.toLocaleString("pt-BR")}
                tickCount={8}
              />
              <Tooltip
                content={<CustomTooltip />}
                labelFormatter={(label) => {
                  const item = chartData.find((item) => item.time === label);
                  return item ? item.fullDate : label;
                }}
              />
              <ReferenceLine
                y={initialPrice}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                label={{
                  value: "Preço Inicial",
                  position: "left",
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={{ r: 3, fill: chartColor }}
                activeDot={{ r: 5, fill: chartColor }}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box
          mt="3"
          style={{ display: "flex", justifyContent: "space-between" }}>
          <Text size="2">
            <span style={{ fontWeight: 500 }}>Preço inicial:</span>{" "}
            <span>
              {initialPrice.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </Text>
          <Text size="2">
            <span style={{ fontWeight: 500 }}>Preço atual:</span>{" "}
            <span>
              {selectedItem.price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </Text>
          <Text size="2">
            <span style={{ fontWeight: 500 }}>Variação:</span>{" "}
            <span
              style={{
                color: selectedItem.variation >= 0 ? "#10b981" : "#ef4444",
                fontWeight: "bold",
              }}>
              {selectedItem.variation >= 0 ? "+" : ""}
              {selectedItem.variation.toFixed(2)}%
            </span>
          </Text>
        </Box>
      </Box>
    </Card>
  );
};

export default PriceChart;
