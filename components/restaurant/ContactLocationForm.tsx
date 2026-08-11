import { Input } from "@/components/ui/input";
import {
  IconGlobe as Globe,
  IconMail as Mail,
  IconMapPin as MapPin,
  IconPhone as Phone,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { RestaurantFormType } from "@/schema/restaurent";

const ContactLocationForm = ({
  form,
}: {
  form: UseFormReturn<RestaurantFormType>;
}) => {
  return (
    <Card className="border-border/60 bg-card shadow-[0_15px_40px_-30px_hsl(var(--foreground)/0.15)]">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            Location & Contact
          </span>
        </div>
        <CardTitle className="mt-1 font-gosh text-xl">
          Where to Find You
        </CardTitle>
        <CardDescription>
          Help customers locate and reach you easily.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Physical Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    placeholder="e.g. Bole Road, Addis Ababa"
                    className="h-11 pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="google_map_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Map URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    placeholder="https://www.google.com/maps"
                    className="h-11 pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <Input
                      type="tel"
                      placeholder="+251 911 234 567"
                      className="h-11 pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    <Input
                      placeholder="info@example.com"
                      className="h-11 pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    placeholder="https://www.yourrestaurant.com"
                    className="h-11 pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ContactLocationForm;
