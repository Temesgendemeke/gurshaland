import React from "react";
import { Card } from "./ui/card";

interface WhyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WhyCard = ({ title, description, icon }: WhyCardProps) => {
  return (
    <Card className="bg-card p-8 text-left transition-colors hover:border-primary/40">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="heading-primary mb-4 text-2xl font-bold">{title}</h3>
      <p className="text-body leading-relaxed">{description}</p>
    </Card>
  );
};

export default WhyCard;
