"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

export const TYPED_PROMPTS = [
  "I want to make shiro. I have chicken and onions.",
  "I have chicken and eggs. I'd love a rich stew.",
  "Make me a vegetarian dish from red lentils and carrots.",
];

const TYPE_SPEED_MS = 55;
const DELETE_SPEED_MS = 28;
const PAUSE_FULL_MS = 1700;
const PAUSE_EMPTY_MS = 450;

function useTypedPrompt(enabled: boolean, reduce: boolean | null): string {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!enabled || reduce) return;

    let phraseIndex = 0;
    let charCount = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = TYPED_PROMPTS[phraseIndex];

      if (!deleting) {
        charCount += 1;
        setText(phrase.slice(0, charCount));

        if (charCount >= phrase.length) {
          timer = setTimeout(() => {
            deleting = true;
            tick();
          }, PAUSE_FULL_MS);
          return;
        }
        timer = setTimeout(tick, TYPE_SPEED_MS);
      } else {
        charCount -= 1;
        setText(phrase.slice(0, charCount));

        if (charCount <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % TYPED_PROMPTS.length;
          timer = setTimeout(tick, PAUSE_EMPTY_MS);
          return;
        }
        timer = setTimeout(tick, DELETE_SPEED_MS);
      }
    };

    const start = setTimeout(() => {
      setText("");
      timer = setTimeout(tick, 60);
    }, 0);

    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [enabled, reduce]);

  return text;
}

interface TypedTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  rows?: number;
}

export default function TypedTextarea({
  value,
  onChange,
  id,
  rows = 4,
}: TypedTextareaProps) {
  const reduce = useReducedMotion();
  const typed = useTypedPrompt(value.length === 0, reduce);
  const display = reduce ? TYPED_PROMPTS[0] : typed;

  return (
    <div className="relative">
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        aria-label="What do you want to cook?"
        className="resize-none"
      />
      {value.length === 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-3 top-2 text-base text-muted-foreground md:text-sm"
        >
          <span className="whitespace-pre-wrap">{display}</span>
          <span
            className={cn(
              "ml-px inline-block w-px self-center bg-muted-foreground",
              !reduce && "animate-caret-blink",
            )}
            style={{ height: "1em" }}
          />
        </div>
      )}
    </div>
  );
}
