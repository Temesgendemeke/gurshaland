import { Card } from "./ui/card";
import howItWorks from "@/constants/howitworks";

function HowItWorksSection({ steps }: { steps: typeof howItWorks }) {
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold heading-primary mb-3">
          How It Works
        </h2>
        <p className="text-lg text-body max-w-2xl mx-auto">
          Three steps from the ingredients in your kitchen to a finished recipe.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <Card key={step.title} className="bg-card p-8 text-center">
            <div className="w-14 h-14 rounded-lg bg-muted text-muted-foreground flex items-center justify-center mb-5 mx-auto">
              <step.icon />
            </div>
            <h3 className="text-lg font-semibold heading-primary mb-3">
              {step.title}
            </h3>
            <p className="text-body text-sm leading-relaxed">{step.desc}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

export default HowItWorksSection;
