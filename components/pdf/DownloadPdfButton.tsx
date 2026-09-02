"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type GeneratePdfResult =
  | { success: true; base64: string; filename: string; creditsUsed: number }
  | { success: false; error: string };

interface DownloadPdfButtonProps {
  generate: () => Promise<GeneratePdfResult>;
  cost: number;
  label?: string;
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
      className={className}
      onClick={handleClick}
      disabled={busy}
      title={`Download as PDF · costs ${cost} credit${cost > 1 ? "s" : ""}`}
    >
      {busy ? (
        <Loader2 className="animate-spin" />
      ) : (
        <FileDown />
      )}
      {busy ? "Generating PDF…" : label}
      <span className="text-[0.6875rem] font-medium opacity-70">
        · {cost} credit{cost > 1 ? "s" : ""}
      </span>
    </Button>
  );
};

export default DownloadPdfButton;
