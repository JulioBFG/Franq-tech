import { Box, Flex, Text } from "@radix-ui/themes";

interface LoadingSpinnerProps {
  text?: string;
  size?: "small" | "medium" | "large";
}

const LoadingSpinner = ({
  text = "Carregando...",
  size = "medium",
}: LoadingSpinnerProps) => {
  const spinnerSize = {
    small: 16,
    medium: 24,
    large: 32,
  }[size];

  const textSize = {
    small: "1",
    medium: "2",
    large: "3",
  }[size] as "1" | "2" | "3";

  return (
    <Flex direction="column" align="center" justify="center" gap="2">
      <Box
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          borderRadius: "50%",
          border: `3px solid #e2e8f0`,
          borderTopColor: "#3861fb",
          animation: "spin 1s linear infinite",
        }}
      />
      {text && (
        <Text size={textSize} color="gray">
          {text}
        </Text>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Flex>
  );
};

export default LoadingSpinner;
