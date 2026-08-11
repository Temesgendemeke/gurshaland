"use client";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { IconLoader as Loader, IconCheck as Save } from "@tabler/icons-react";
import { Button } from "../ui/button";
import BasicInforForm from "./BasicInforForm";
import ContactLocationForm from "./ContactLocationForm";
import MenuForm from "./MenuForm";
import GalleryForm from "./GalleryForm";

interface RestaurentFormProps {
  form: ReturnType<typeof useForm<any>>;
  onSubmit: (data: any) => void;
  mode?: "create" | "edit";
}

const RestaurantForm = ({
  form,
  onSubmit,
  mode = "create",
}: RestaurentFormProps) => {
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <BasicInforForm form={form} />

          {/* Contact & Location Card */}
          <ContactLocationForm form={form} />

          {/* Menu Section Card */}
          <MenuForm form={form} />

          {/* gallery */}
          <GalleryForm form={form} />

          {/* Submit Action */}
          <div className="sticky bottom-4 z-10">
            <div className="pointer-events-none absolute inset-x-0 -top-16 -z-10 h-24 bg-gradient-to-t from-background to-transparent" />
            <Button
              type="submit"
              size="lg"
              className="h-14 w-full rounded-2xl text-lg font-semibold shadow-[0_15px_35px_-15px_hsl(var(--primary)/0.4)] btn-primary-modern"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" strokeWidth={2} />
                  <span>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" strokeWidth={2} />
                  <span>
                    {mode === "create"
                      ? "Create Restaurant Profile"
                      : "Update Restaurant Profile"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantForm;
