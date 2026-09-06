"use client";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { IconLoader as Loader, IconCheck as Check } from "@tabler/icons-react";
import { Button } from "../ui/button";
import BasicInforForm from "./BasicInforForm";
import ContactLocationForm from "./ContactLocationForm";
import MenuForm from "./MenuForm";
import GalleryForm from "./GalleryForm";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RestaurentFormProps {
  form: ReturnType<typeof useForm<any>>;
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
  cancelHref?: string;
}

const RestaurantForm = ({
  form,
  onSubmit,
  mode = "create",
  cancelHref,
}: RestaurentFormProps) => {
  const isDirty = form.formState.isDirty;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            const errorKeys = Object.keys(errors);
            if (errorKeys.length > 0) {
              const firstKey = errorKeys[0];
              const firstErr = (errors as Record<string, any>)[firstKey];
              const message =
                firstErr?.message ||
                firstErr?.root?.message ||
                `Please check the ${firstKey} field`;
              toast.error(String(message));
            }
          })}
          className="space-y-6"
        >
          {/* Basic Information Card */}
          <BasicInforForm form={form} />

          {/* Contact & Location Card */}
          <ContactLocationForm form={form} />

          {/* Menu Section Card */}
          <MenuForm form={form} />

          {/* Gallery Section */}
          <GalleryForm form={form} />

          {/* Professional Action Bar */}
          <div className="sticky bottom-3 sm:bottom-4 z-20">
            <div className="flex items-center justify-between gap-2 sm:gap-4 rounded-xl border border-border bg-card/95 p-2 sm:p-3.5 backdrop-blur-md shadow-none">
              <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1 min-w-0">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    isDirty ? "bg-amber-500" : "bg-muted-foreground/40",
                  )}
                />
                <span className="hidden sm:inline truncate">
                  {isDirty ? "Unsaved modifications" : "No pending changes"}
                </span>
                <span className="sm:hidden text-[11px] truncate">
                  {isDirty ? "Unsaved" : "Saved"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {cancelHref ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Link href={cancelHref}>Cancel</Link>
                  </Button>
                ) : (
                  isDirty && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => form.reset()}
                      className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </Button>
                  )
                )}

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="font-medium px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      <span>{mode === "create" ? "Creating..." : "Saving..."}</span>
                    </>
                  ) : (
                    <>
                      <Check className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{mode === "create" ? "Create Profile" : "Save Changes"}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantForm;
