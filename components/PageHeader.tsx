import { Sparkles } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center space-x-2 modern-card rounded-full px-4 py-2 mb-6">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          Powered by AI
        </span>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        <span className="gradient-text-primary">AI-Powered</span>
        <br />
        <span className="heading-primary">Cooking Experience</span>
      </h1>
      <p className="text-xl text-body max-w-3xl mx-auto leading-relaxed">
        Discover the future of Ethiopian cooking with our intelligent features
        that help you create, learn, and master traditional recipes with modern
        AI assistance.
      </p>
    </div>
  );
}
