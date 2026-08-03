import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Recipe {
  id: number
  title: string
  description: string
  image: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  time: string
  servings: number
  rating: number
  reviews: number
  author: string
  tags: string[]
  isFeatured?: boolean
  isNew?: boolean
  isTrending?: boolean
}

export interface CulturalStory {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  readTime: string
  author: string
  date: string
  isFeatured?: boolean
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  readTime: string
  author: string
  date: string
  isFeatured?: boolean
  tags: string[]
}

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  favoriteRecipes: number[]
  savedRecipes: number[]
  preferences: {
    dietaryRestrictions: string[]
    spiceLevel: "Mild" | "Medium" | "Spicy"
    cookingExperience: "Beginner" | "Intermediate" | "Advanced"
  }
}

interface AppState {
  // Data
  recipes: Recipe[]
  culturalStories: CulturalStory[]
  blogPosts: BlogPost[]
  user: User | null

  // UI State
  isLoading: boolean
  searchQuery: string
  selectedCategory: string
  featuredContent: {
    recipes: Recipe[]
    stories: CulturalStory[]
    posts: BlogPost[]
  }

  // Actions
  setRecipes: (recipes: Recipe[]) => void
  setCulturalStories: (stories: CulturalStory[]) => void
  setBlogPosts: (posts: BlogPost[]) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  toggleFavoriteRecipe: (recipeId: number) => void
  toggleSavedRecipe: (recipeId: number) => void
  getFeaturedContent: () => void
  getRecommendedRecipes: () => Recipe[]
  getTrendingRecipes: () => Recipe[]
  getNewRecipes: () => Recipe[]
}

// Mock data
const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Traditional Injera",
    description: "The foundation of Ethiopian cuisine - fermented flatbread made from teff flour",
    image: "/placeholder.svg?height=300&width=400",
    category: "Bread",
    difficulty: "Medium",
    time: "3 days",
    servings: 8,
    rating: 4.8,
    reviews: 124,
    author: "Almaz Tadesse",
    tags: ["Traditional", "Gluten-Free", "Fermented"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 2,
    title: "Doro Wat",
    description: "Ethiopia's national dish - spicy chicken stew with berbere and hard-boiled eggs",
    image: "/placeholder.svg?height=300&width=400",
    category: "Meat",
    difficulty: "Hard",
    time: "2 hours",
    servings: 6,
    rating: 4.9,
    reviews: 89,
    author: "Kebede Alemu",
    tags: ["Spicy", "Traditional", "Festive"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 3,
    title: "Shiro Wat",
    description: "Creamy chickpea flour stew - a beloved vegetarian staple",
    image: "/placeholder.svg?height=300&width=400",
    category: "Vegetarian",
    difficulty: "Easy",
    time: "45 min",
    servings: 4,
    rating: 4.7,
    reviews: 156,
    author: "Hanan Mohammed",
    tags: ["Vegetarian", "Quick", "Protein-Rich"],
    isFeatured: true,
    isNew: true,
  },
  {
    id: 4,
    title: "Ethiopian Coffee Ceremony",
    description: "Traditional coffee preparation ritual from green beans to perfect cup",
    image: "/placeholder.svg?height=300&width=400",
    category: "Beverages",
    difficulty: "Medium",
    time: "1 hour",
    servings: 6,
    rating: 4.8,
    reviews: 91,
    author: "Selamawit Girma",
    tags: ["Coffee", "Ceremony", "Traditional"],
    isNew: true,
  },
  {
    id: 5,
    title: "Berbere Spice Blend",
    description: "The soul of Ethiopian cooking - aromatic spice blend with 15+ ingredients",
    image: "/placeholder.svg?height=300&width=400",
    category: "Spices",
    difficulty: "Easy",
    time: "1 hour",
    servings: 20,
    rating: 4.9,
    reviews: 203,
    author: "Tigist Haile",
    tags: ["Spice", "Essential", "Homemade"],
    isTrending: true,
  },
  {
    id: 6,
    title: "Kitfo",
    description: "Ethiopian steak tartare seasoned with mitmita spice and clarified butter",
    image: "/placeholder.svg?height=300&width=400",
    category: "Meat",
    difficulty: "Medium",
    time: "30 min",
    servings: 2,
    rating: 4.6,
    reviews: 67,
    author: "Dawit Bekele",
    tags: ["Raw", "Spicy", "Gourmet"],
    isNew: true,
  },
]

const mockCulturalStories: CulturalStory[] = [
  {
    id: 1,
    title: "The Sacred Ethiopian Coffee Ceremony",
    excerpt: "Discover the spiritual and social significance of Ethiopia's ancient coffee ritual",
    image: "/placeholder.svg?height=200&width=300",
    category: "Traditions",
    readTime: "8 min read",
    author: "Dr. Almaz Bekele",
    date: "March 15, 2024",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Gursha: The Art of Communal Feeding",
    excerpt: "How the tradition of feeding each other strengthens Ethiopian community bonds",
    image: "/placeholder.svg?height=200&width=300",
    category: "Traditions",
    readTime: "6 min read",
    author: "Meron Haile",
    date: "March 12, 2024",
    isFeatured: true,
  },
]

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Essential Ethiopian Spices Every Cook Should Know",
    excerpt: "Master the foundation of Ethiopian cuisine with these must-have spices and blends",
    image: "/placeholder.svg?height=200&width=300",
    category: "Cooking Tips",
    readTime: "7 min read",
    author: "Chef Dawit Bekele",
    date: "March 18, 2024",
    isFeatured: true,
    tags: ["Spices", "Beginner", "Essential"],
  },
  {
    id: 2,
    title: "Modern Ethiopian Fusion: Tradition Meets Innovation",
    excerpt: "How contemporary chefs are reimagining classic Ethiopian dishes for modern palates",
    image: "/placeholder.svg?height=200&width=300",
    category: "Innovation",
    readTime: "10 min read",
    author: "Chef Tigist Haile",
    date: "March 16, 2024",
    isFeatured: true,
    tags: ["Modern", "Fusion", "Innovation"],
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      recipes: mockRecipes,
      culturalStories: mockCulturalStories,
      blogPosts: mockBlogPosts,
      user: null,
      isLoading: false,
      searchQuery: "",
      selectedCategory: "all",
      featuredContent: {
        recipes: [],
        stories: [],
        posts: [],
      },

      // Actions
      setRecipes: (recipes) => set({ recipes }),
      setCulturalStories: (stories) => set({ culturalStories: stories }),
      setBlogPosts: (posts) => set({ blogPosts: posts }),
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      toggleFavoriteRecipe: (recipeId) => {
        const { user } = get()
        if (!user) return

        const updatedUser = {
          ...user,
          favoriteRecipes: user.favoriteRecipes.includes(recipeId)
            ? user.favoriteRecipes.filter((id) => id !== recipeId)
            : [...user.favoriteRecipes, recipeId],
        }
        set({ user: updatedUser })
      },

      toggleSavedRecipe: (recipeId) => {
        const { user } = get()
        if (!user) return

        const updatedUser = {
          ...user,
          savedRecipes: user.savedRecipes.includes(recipeId)
            ? user.savedRecipes.filter((id) => id !== recipeId)
            : [...user.savedRecipes, recipeId],
        }
        set({ user: updatedUser })
      },

      getFeaturedContent: () => {
        const { recipes, culturalStories, blogPosts } = get()

        const featuredRecipes = recipes.filter((recipe) => recipe.isFeatured).slice(0, 3)
        const featuredStories = culturalStories.filter((story) => story.isFeatured).slice(0, 2)
        const featuredPosts = blogPosts.filter((post) => post.isFeatured).slice(0, 2)

        set({
          featuredContent: {
            recipes: featuredRecipes,
            stories: featuredStories,
            posts: featuredPosts,
          },
        })
      },

      getRecommendedRecipes: () => {
        const { recipes, user } = get()
        if (!user) return recipes.slice(0, 4)

        // Simple recommendation based on user preferences
        return recipes
          .filter((recipe) => {
            if (user.preferences.dietaryRestrictions.includes("vegetarian")) {
              return recipe.category === "Vegetarian"
            }
            return true
          })
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4)
      },

      getTrendingRecipes: () => {
        const { recipes } = get()
        return recipes.filter((recipe) => recipe.isTrending).slice(0, 4)
      },

      getNewRecipes: () => {
        const { recipes } = get()
        return recipes.filter((recipe) => recipe.isNew).slice(0, 4)
      },
    }),
    {
      name: "gurshaland-storage",
      partialize: (state) => ({
        user: state.user,
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
      }),
    },
  ),
)
