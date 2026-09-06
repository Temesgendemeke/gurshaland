import { useState, useEffect } from "react";

interface TypingPlaceholderOptions {
  typing?: number;
  deleting?: number;
  hold?: number;
}

export function useTypingPlaceholder(
  examples: string[],
  options: TypingPlaceholderOptions = {},
) {
  const { typing = 45, deleting = 18, hold = 1800 } = options;
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!examples || examples.length === 0) return;

    const current = examples[index % examples.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), hold);
    } else if (isDeleting && text === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((i) => (i + 1) % examples.length);
      }, 300);
    } else {
      const delay = isDeleting ? deleting : typing;
      timeout = setTimeout(() => {
        setText((prev) =>
          isDeleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1),
        );
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, examples, typing, deleting, hold]);

  return text;
}
