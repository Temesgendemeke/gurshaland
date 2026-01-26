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
    <Card className="p-8 text-left hover:shadow-sm">
      <div className="w-16 h-16 bg-linear-to-br from-primary via-primary/80 to-primary/60 rounded-2xl flex items-center justify-center mb-6 ">
        {icon}
      </div>
      <h3 className="text-2xl font-bold heading-primary mb-4">{title}</h3>
      <p className="text-body leading-relaxed">{description}</p>
    </Card>
  );
};

export default WhyCard;
