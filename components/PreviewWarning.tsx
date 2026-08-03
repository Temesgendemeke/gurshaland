import Link from "next/link";
import { PencilSquareIcon as PenBoxIcon } from "@heroicons/react/24/outline";

type PreviewWarningProps = {
  slug: string;
  postType: string;
  author_id: string;
  user_id: string;
  status: string;
};

const PreviewWarning = ({
  slug,
  postType,
  author_id,
  user_id,
  status,
}: PreviewWarningProps) => {
  if (author_id === user_id && status === "draft") {
    return (
      <div className="p-4 bg-error text-error-foreground border border-error/20 rounded-lg shadow-sm flex justify-between items-center">
        <p className="text-sm font-medium">
          This {postType} is currently in draft mode and is only visible to you.
        </p>
        <Link
          href={`/${postType === "recipe" ? "recipes" : "blogs"}/edit/${slug}`}
          className="text-error-foreground text-sm border border-error-foreground/30 rounded-lg p-2 px-4 hover:bg-error-foreground hover:text-error transition-all duration-200 flex items-center gap-2"
        >
          <PenBoxIcon className="w-4 h-4" />
          <span>Edit {postType}</span>
        </Link>
      </div>
    );
  }
  return null;
};

export default PreviewWarning;
