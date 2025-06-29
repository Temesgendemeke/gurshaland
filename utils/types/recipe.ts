interface Ingredient {
  item: string;
  amount: string;
  notes: string;
}

interface Instruction {
  title: string;
  description: string;
  time: string;
  tips: string;
}

export default interface Recipe {
  title: string;
  category: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  culturalNote: string;
  image: string;
  status: "draft" | "published";
}
