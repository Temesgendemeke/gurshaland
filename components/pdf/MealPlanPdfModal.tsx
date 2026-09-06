"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Printer,
  ExternalLink,
  Loader2,
  Calendar,
  Utensils,
  Flame,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { GeneratePdfResult } from "./DownloadPdfButton";

interface MealPlanPdfModalProps {
  generate: () => Promise<GeneratePdfResult>;
  cost: number;
  plan: {
    name?: string;
    days?: Array<{ day?: string; meals?: any[] }>;
    calories?: number;
    goal?: string;
    diet?: string;
    shopping_list?: string[];
  };
  triggerLabel?: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const MealPlanPdfModal: React.FC<MealPlanPdfModalProps> = ({
  generate,
  cost,
  plan,
  triggerLabel = "Export PDF",
  variant = "outline",
  size = "sm",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfData, setPdfData] = useState<{
    dataUrl: string;
    filename: string;
  } | null>(null);

  const daysCount = plan.days?.length || 0;
  const mealsCount = (plan.days || []).reduce(
    (acc, d) => acc + (d.meals?.length || 0),
    0,
  );
  const groceryCount = plan.shopping_list?.length || 0;

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const result = await generate();
      if (!result.success) {
        toast.error(result.error || "Failed to generate PDF document");
        return;
      }

      const dataUrl = `data:application/pdf;base64,${result.base64}`;
      setPdfData({
        dataUrl,
        filename: result.filename,
      });

      // Auto-trigger download for seamless UX
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = result.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      toast.success(
        `PDF downloaded · ${result.creditsUsed} credit${
          result.creditsUsed > 1 ? "s" : ""
        } used`,
      );
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("An unexpected error occurred while rendering the PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInTab = () => {
    if (!pdfData) return;
    const win = window.open(pdfData.dataUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      toast.info("Pop-up blocked: downloading PDF instead.");
      const a = document.createElement("a");
      a.href = pdfData.dataUrl;
      a.download = pdfData.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handlePrint = () => {
    if (!pdfData) return;
    const printWindow = window.open(pdfData.dataUrl);
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    } else {
      handleOpenInTab();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "gap-2 border-border/80 font-medium transition-all active:scale-[0.98] shadow-none",
            className,
          )}
        >
          <FileDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>{triggerLabel}</span>
          <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground/80 shrink-0">
            · {cost} cr
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-none">
        <DialogHeader className="text-left space-y-1.5 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileDown className="h-4 w-4" />
            </span>
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Printable Meal Plan PDF
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Generate an executive-grade, editorial printable itinerary formatted for A4 standard.
          </DialogDescription>
        </DialogHeader>

        {/* Plan Overview Card */}
        <div className="space-y-3.5 py-2">
          <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-foreground line-clamp-1">
                {plan.name ?? "Personalized Meal Plan"}
              </h4>
              <span className="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                A4 Vector PDF
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="flex items-center gap-2 rounded-lg bg-background border border-border/60 p-2">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Duration</p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {daysCount} {daysCount === 1 ? "Day" : "Days"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-background border border-border/60 p-2">
                <Utensils className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Courses</p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {mealsCount} Meals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-background border border-border/60 p-2">
                <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Target</p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {plan.calories ? `~${plan.calories}` : "Flexible"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-background border border-border/60 p-2">
                <ShoppingBag className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Pantry</p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {groceryCount} Items
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="rounded-xl border border-border/60 bg-muted/10 p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="flex items-center gap-2 text-foreground font-medium text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              Included in this print edition:
            </p>
            <p className="pl-5 text-[11px] leading-relaxed">
              • Complete daily schedule with macros, calorie calculations, and dish notes
            </p>
            <p className="pl-5 text-[11px] leading-relaxed">
              • Printable 2-column grocery checklist and Chef&apos;s culinary advice
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {pdfData ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Document ready
              </span>
            ) : (
              <span>
                Export cost: <strong className="text-foreground">{cost} Credit</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {pdfData ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInTab}
                  className="h-9 gap-1.5 text-xs flex-1 sm:flex-initial"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Tab</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="h-9 gap-1.5 text-xs flex-1 sm:flex-initial"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="h-9 gap-1.5 text-xs flex-1 sm:flex-initial font-semibold"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileDown className="h-3.5 w-3.5" />
                  )}
                  <span>Re-download</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="h-9 px-4 gap-2 text-xs font-semibold shadow-none flex-1 sm:flex-initial"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating PDF…</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="h-3.5 w-3.5" />
                      <span>Generate & Download</span>
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanPdfModal;
