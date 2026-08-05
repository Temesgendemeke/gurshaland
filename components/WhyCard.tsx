import React from "react";
import { Card } from "./ui/card";
import { BookOpen } from "lucide-react";

interface WhyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WhyCard = ({ title, description, icon }: WhyCardProps) => {
  return (
    <Card className="p-8 text-left hover:shadow-sm bg-card transition-colors">
      <div className="w-14 h-14 bg-primary/80 text-primary rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold heading-primary mb-4">{title}</h3>
      <p className="text-body leading-relaxed">{description}</p>
    </Card>
  );
};

export default WhyCard;
