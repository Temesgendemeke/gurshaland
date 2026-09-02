"use client";
import ReactMarkdown, { type Components } from "react-markdown";
import { cn } from "@/lib/utils";

const components: Components = {
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-1 list-disc space-y-1 pl-5 marker:text-primary/70">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1 list-decimal space-y-1 pl-5 marker:text-primary/70">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => (
    <h1 className="my-2 text-base font-bold text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="my-2 text-sm font-bold text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="my-1.5 text-sm font-semibold text-foreground">
      {children}
    </h3>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
          {children}
        </code>
      );
    }
    return (
      <pre className="my-2 overflow-x-auto rounded-lg border border-border bg-muted/60 p-3 font-mono text-xs text-foreground">
        <code className={className}>{children}</code>
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-primary/60 pl-3 text-muted-foreground">
      {children}
    </blockquote>
  ),
};

export default function ChatMarkdown({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1 text-[0.875rem]", className)}>
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );
}
