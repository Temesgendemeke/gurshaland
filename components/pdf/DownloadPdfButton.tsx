"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type GeneratePdfResult =
  | { success: true; base64: string; filename: string; creditsUsed: number }
  | { success: false; error: string };

interface DownloadPdfButtonProps {
  generate: () => Promise<GeneratePdfResult>;
  cost: number;
  label?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const DownloadPdfButton = ({
  generate,
  cost,
  label = "Download PDF",
  variant = "outline",
  size = "sm",
  className,
}: DownloadPdfButtonProps) => {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await generate();
      if (!result.success) {
        toast.error(result.error || "Failed to generate PDF");
        return;
      }

      const dataUrl = `data:application/pdf;base64,${result.base64}`;
      const opened = window.open(dataUrl, "_blank", "noopener,noreferrer");
      if (!opened) {
        const anchor = document.createElement("a");
        anchor.href = dataUrl;
        anchor.download = result.filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }

      toast.success(
        `PDF ready · ${result.creditsUsed} credit${
          result.creditsUsed > 1 ? "s" : ""
        } used`,
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Something went wrong generating the PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("gap-1.5 transition-all duration-150 active:scale-[0.98]", className)}
      onClick={handleClick}
      disabled={busy}
      title={`Download as PDF · costs ${cost} credit${cost > 1 ? "s" : ""}`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
      <span>{busy ? "Generating…" : label}</span>
      <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/80 shrink-0">
        · {cost} <span className="hidden sm:inline">credit{cost > 1 ? "s" : ""}</span><span className="sm:hidden">cr</span>
      </span>
    </Button>
  );
};

export default DownloadPdfButton;
