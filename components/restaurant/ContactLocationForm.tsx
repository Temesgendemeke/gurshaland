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
    <Card className="border border-border bg-card/60 rounded-xl">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
          Location & Contact
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Physical location, map coordinates, and primary contact methods for diners.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4 sm:space-y-5">
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
                    placeholder="e.g. Bole Road, Behind Edna Mall, Addis Ababa"
                    className="h-10 pl-9"
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
              <FormLabel>Google Maps Link</FormLabel>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    placeholder="https://maps.google.com/?q=..."
                    className="h-10 pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                      placeholder="+251 91 123 4567"
                      className="h-10 pl-9"
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
                      type="email"
                      placeholder="contact@restaurant.com"
                      className="h-10 pl-9"
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
              <FormLabel>Official Website</FormLabel>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <Input
                    placeholder="https://www.yourrestaurant.com"
                    className="h-10 pl-9"
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
