"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { FeedAI } from "@/ai/chunking";

const feedContextSchema = z
  .object({
    text: z.string().optional(),
    file: z.any().optional(),
  })
  .refine((data) => data.text || data.file, {
    message: "Either text or a PDF file must be provided",
    path: ["text"],
  });

const FeedContextPage = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm({
    resolver: zodResolver(feedContextSchema),
    defaultValues: {
      text: "",
      file: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof feedContextSchema>) => {
    setLoading(true);

    try {
      // Logic for saving to Supabase would go here
      // For now, mirroring existing simulated behavior but with better feedback

      const fileToUpload = values.file?.[0] as File | undefined;
      const res = await FeedAI(values.text || "", fileToUpload);

      if (!res) {
        toast.error("Failed to feed AI");
        return;
      }
      toast.success("Knowledge base updated successfully!");

      // Simulate/Handle file upload if needed

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Knowledge base updated successfully!");
      form.reset();
      setFileName(null);
    } catch (error: any) {
      console.error("Error submitting context:", error);
      toast.error(error.message || "Failed to submit content");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: FileList | null) => void,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      onChange(files);
    } else {
      setFileName(null);
      onChange(null);
    }
  };

  const removeFile = (onChange: (files: null) => void) => {
    setFileName(null);
    onChange(null);
  };

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feed AI Content</h1>
        <p className="text-muted-foreground mt-1">
          Provide contextual documents or text to enhance AI responses.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Text Knowledge
              </CardTitle>
              <CardDescription>
                Paste specialized information, FAQs, or cultural notes here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Traditional Ethiopian coffee ceremonies involve several stages..."
                        className="min-h-[250px] resize-y p-4 border-muted focus-visible:ring-primary/30 transition-shadow bg-background/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload PDF reports, menus, or researched documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const files = e.dataTransfer.files;
                          if (files?.length) {
                            setFileName(files[0].name);
                            onChange(files);
                          }
                        }}
                        className={cn(
                          "relative group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 transition-all duration-200 bg-background/30",
                          isDragging
                            ? "border-primary bg-primary/5 scale-[1.01]"
                            : "border-muted-foreground/20 hover:border-primary/50",
                          fileName && "border-primary bg-primary/5",
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {!fileName ? (
                            <motion.div
                              key="upload-prompt"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-center space-y-4"
                            >
                              <div className="bg-muted p-4 rounded-full mx-auto w-fit group-hover:bg-primary/10 transition-colors">
                                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">
                                  Drag and drop or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Supporting PDF files up to 10MB
                                </p>
                              </div>
                              <Input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                id="pdf-upload"
                                onChange={(e) => handleFileChange(e, onChange)}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  document.getElementById("pdf-upload")?.click()
                                }
                              >
                                Select PDF
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="file-selected"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center space-y-4 w-full"
                            >
                              <div className="bg-success/10 border border-success/20 p-4 rounded-full mx-auto w-fit">
                                <CheckCircle2 className="w-8 h-8 text-success" />
                              </div>
                              <div className="px-12">
                                <p className="text-sm font-bold truncate max-w-xs mx-auto">
                                  {fileName}
                                </p>
                                <p className="text-xs text-success font-medium mt-1">
                                  Ready for processing
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeFile(onChange)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove and choose another
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-between p-6 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>Content will be processed into vector embeddings.</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                "Submit to Knowledge Base"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedContextPage;
