import { Card } from "./ui/card";
import howItWorks from "@/constants/howitworks";

function HowItWorksSection({ steps }: { steps: typeof howItWorks }) {
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold heading-primary mb-4">
          How Our AI Works
        </h2>
        <p className="text-xl text-body max-w-2xl mx-auto">
          Our AI is trained on thousands of authentic Ethiopian recipes and
          cooking techniques
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {steps.map((step) => (
          <Card key={step.title} className="modern-card p-8 text-center">
            <div
              className={`w-16 h-16 bg-gradient-to-br ${step.bg} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
            >
              <step.icon/>
            </div>
            <h3 className="text-xl font-bold heading-primary mb-4">
              {step.title}
            </h3>
            <p className="text-body">{step.desc}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

export default HowItWorksSection;
