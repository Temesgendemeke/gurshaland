import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

function NewsletterSignup() {
  return (
    <div className="mt-20">
      <Card className="p-12 text-center bg-gradient-to-r from-emerald-600/10 to-red-600/10 dark:from-emerald-600/20 dark:to-red-600/20 border-emerald-200 dark:border-emerald-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Stay Updated
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Get the latest Ethiopian recipes, cultural stories, and cooking tips
          delivered to your inbox
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            placeholder="Enter your email"
            className="flex-1 border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-900"
          />
          <Button className="bg-gradient-to-r from-emerald-600 text-white">
            Subscribe
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default NewsletterSignup;
