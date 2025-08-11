import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Search } from "lucide-react";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { TablePagination } from "./TablePagination";

const posts = [
  {
    id: 1,
    title: "Understanding React Hooks",
    like: 120,
    view: 1500,
    status: "Published",
    slug: "understanding-react-hooks",
  },
  {
    id: 2,
    title: "A Guide to TypeScript",
    like: 80,
    view: 900,
    status: "Draft",
    slug: "a-guide-to-typescript",
  },
  {
    id: 3,
    title: "Styling in Next.js",
    like: 95,
    view: 1100,
    status: "Published",
    slug: "styling-in-nextjs",
  },
  {
    id: 4,
    title: "Deploying with Vercel",
    like: 60,
    view: 700,
    status: "Archived",
    slug: "deploying-with-vercel",
  },
  {
    id: 5,
    title: "API Routes Explained",
    like: 130,
    view: 1700,
    status: "Published",
    slug: "api-routes-explained",
  },
  {
    id: 6,
    title: "Optimizing Performance",
    like: 75,
    view: 850,
    status: "Draft",
    slug: "optimizing-performance",
  },
  {
    id: 7,
    title: "Authentication Strategies",
    like: 110,
    view: 1400,
    status: "Published",
    slug: "authentication-strategies",
  },
];
const headers = ["Title", "Like", "View", "Status"];
const status = ["All", "Published", "Draft"];

interface Post {
  id: string;
  title: string;
  like: number;
  view: number;
  status: "published" | "draft";
  slug: string;
}

interface Followers {
  id: string;
  username: string;
  follwed_since: string;
  like: number;
  comments: number;
}

interface DataTableProps {
  name: "recieps" | "followers" | "blogs";
  data: Post[];
}

export function DataTable({ name, data }: DataTableProps) {
  // const name = "recipes";

  return (
    <div className="mx-5 space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-grow">
          <Input placeholder={`search ${name}`} className="pl-10" />
          <Search className="absolute top-1/2 left-2 transform -translate-y-1/2" />
        </div>
        <div className="w-40">
          <Select defaultValue="All">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className={`bg-background`}
            >
              {status.map((s, index) => (
                <SelectItem key={index} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="shadow-lg w-full">
        <TableCaption>A list of your recent {name}.</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header, idx) => (
              <TableHead key={idx} className="w-auto">
                {header}
              </TableHead>
            ))}

            <TableHead className="w-16 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="w-2/5">{post.title}</TableCell>
              <TableCell className="w-1/5">{post.like}</TableCell>
              <TableCell className="w-1/5">{post.view}</TableCell>
              <TableCell className="w-1/5">{post.status}</TableCell>
              <TableCell className="w-16 text-right">
                <Button variant="ghost">
                  <EllipsisVertical />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className="bg-transparent hover:bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={headers.length}
              className="hover:bg-transparent"
            >
              <p>0 of 68 row(s) selected.</p>
            </TableCell>
            <TableCell className="flex justify-end">
              <TablePagination />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
