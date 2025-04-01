import { Box, Flex, Text } from "@radix-ui/themes";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="2"
      style={{ padding: "40px 16px" }}>
      {icon && (
        <Box style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</Box>
      )}

      <Text size="3" weight="medium" align="center">
        {title}
      </Text>

      {description && (
        <Text size="2" color="gray" align="center">
          {description}
        </Text>
      )}

      {action && <Box style={{ marginTop: "16px" }}>{action}</Box>}
    </Flex>
  );
};

export default EmptyState;
