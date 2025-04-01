import { Card as CardPrimitive } from "@radix-ui/themes";
import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <CardPrimitive>{children}</CardPrimitive>;
};

export default Card;
