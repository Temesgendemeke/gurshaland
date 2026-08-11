import { IconGlobe as Globe, IconMapPin as MapPin } from "@tabler/icons-react";
import Link from "next/link";

interface AddressSectionProps {
  address: string;
  website: string;
  google_map_url: string;
}

const AddressSection = ({
  address,
  website,
  google_map_url,
}: AddressSectionProps) => {
  return (
    <div>
      <h2 className="font-gosh text-2xl font-bold tracking-tight text-foreground">
        Address
      </h2>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 rounded-xl border border-border/60 bg-card p-4 text-sm">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
          {address ? address : "Address"}
        </span>
        {website && (
          <Link
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
          >
            <Globe className="h-4 w-4 text-primary" strokeWidth={1.5} />
            Website
          </Link>
        )}
        {google_map_url && (
          <Link
            href={google_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
          >
            <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
            Google Map
          </Link>
        )}
      </div>
    </div>
  );
};

export default AddressSection;
