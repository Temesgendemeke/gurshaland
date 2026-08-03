import { useQuery } from "@tanstack/react-query";

export const useAssistant = (prompt: String) => {
  const { data, error } = useQuery({
    queryKey: ["assistant"],
    queryFn: async () => {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch assistant data");
      }
      return response.json();
    },
  });

  return { data, error };
};
