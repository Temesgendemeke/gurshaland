import React from "react";
import { Card } from "./ui/card";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const CTACard = () => {
  return (
    <Card className="modern-card p-12 text-center bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20">
      <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-6" />
      <h2 className="text-3xl font-bold heading-primary mb-4">
        Ready to Cook with AI?
      </h2>
      <p className="text-xl text-body mb-8 max-w-2xl mx-auto">
        Join thousands of home cooks who are already using AI to master
        Ethiopian cuisine
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          className="btn-primary-modern px-8 py-4 text-lg rounded-full"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Cooking with AI
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg rounded-full"
        >
          Learn More
        </Button>
      </div>
    </Card>
  );
};

export default CTACard;
