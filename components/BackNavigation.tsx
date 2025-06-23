import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  route: string;
  pagename: string;
}

const BackNavigation = ({ route, pagename }: Props) => {
  return (
    <Button
      asChild
      variant="ghost"
      className="mb-6 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
    >
      <Link href={route}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {pagename}
      </Link>
    </Button>
  );
};

export default BackNavigation;
