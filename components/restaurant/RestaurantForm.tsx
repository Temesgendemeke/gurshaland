"use client"
import { useForm, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import restaurantSchema, { GetRestaurentType, RestaurantFormType } from "@/schema/restaurent";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Globe, Loader2, Mail, MapPin, Phone, PlusIcon, Save, Store, Trash, UtensilsCrossed } from "lucide-react";
import { CircleAlert } from "lucide-react";
import ImageBox from "../ImageBox";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import MenuInputSection from "./MenuInputSection";
import { useFieldArray } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import BasicInforForm from "./BasicInforForm";
import ContactLocationForm from "./ContactLocationForm";
import MenuForm from "./MenuForm";
import GalleryForm from "./GalleryForm";


interface RestaurentFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  mode?: 'create' | 'edit'
}


const RestaurantForm = ({ form, onSubmit, mode = "create" }: RestaurentFormProps) => {


  return <div>
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
          <div className="absolute inset-0  -z-10 h-24 -top-24 pointer-events-none" />
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold hover:-translate-y-1 transition-all rounded-xl btn-primary-modern"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>{mode == "create" ? "Creating..." : "Updating..."}</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                <span>{mode == "create" ? "Create Restaurant Profile" : "Update Restaurant Profile"}</span>
              </>
            )}
          </Button>
        </div>

      </form>
    </Form>
  </div>
}


export default RestaurantForm;