import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

function NewsletterSignup() {
  return (
    <div className="mt-20">
      <Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-popular/10 border-primary/20">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Stay Updated
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get the latest Ethiopian recipes, cultural stories, and cooking tips
          delivered to your inbox
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            placeholder="Enter your email"
            className="flex-1 border-primary/20 bg-background"
          />
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Subscribe
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default NewsletterSignup;
