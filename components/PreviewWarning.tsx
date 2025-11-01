import Link from "next/link";
import { PenBoxIcon } from "lucide-react";

type PreviewWarningProps = {
    slug: string;
    postType: string;
    author_id: string;
    user_id: string;
    status: string;
}

const PreviewWarning = ({ slug, postType, author_id, user_id, status }: PreviewWarningProps) => {
    if (author_id === user_id && status === 'draft') {
        return (
            <div className="p-4 bg-red-600 border hover:animate-none  border-red-200 rounded-lg text-white   shadow-sm items-center dark:bg-red-800 dark:border-red-700 flex justify-between">
                <p className="text-sm font-medium ">
                    This {postType} is currently in draft mode and is only visible to you.
                </p>
                <Link href={`/${postType === 'recipe' ? 'recipes' : 'blogs'}/edit/${slug}`} className="text-white text-sm border  rounded-lg p-2 px-4 hover:bg-white hover:text-red-800 duration-300 ease-in border-white dark:border-slate-300 flex items-center gap-2">
                    <PenBoxIcon />
                    <span>Edit {postType}</span>
                </Link>
            </div>
        );
    }
    return null;
};

export default PreviewWarning;