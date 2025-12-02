import { Globe2Icon, LocateIcon, MapPin } from "lucide-react";
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
      <h2 className="text-2xl font-bold">Address</h2>

      <div className="flex gap-4 mt-2">
        <div className="flex gap-4">
          <div className="flex gap-2">
            <MapPin />
            <span>{address ? address : "Addres"}</span>
          </div>
        </div>
        <Link href={website ? website : ""} className="flex gap-2">
          {" "}
          <Globe2Icon />
          Website
        </Link>
        <Link
          href={google_map_url ? google_map_url : ""}
          className="flex gap-2"
        >
          <MapPin />
          <span>Google Map</span>
        </Link>
      </div>
    </div>
  );
};

export default AddressSection;
