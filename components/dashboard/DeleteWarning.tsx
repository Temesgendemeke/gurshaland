"use client"
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useBlog } from "@/store/DashboardBlog";
import useRecipe from "@/store/DashboardRecipe"
import { Trash } from "lucide-react"
import { toast } from "sonner";

function DeleteWarning({post, slug}: {post: "/recipes" | "/blog", slug:string}) {

  const deleteRecipe = useRecipe((store) => store.deleteRecipe);
  const deleteBlog  = useBlog((store) => store.deleteBlog);





  const handleDelete = async () => {


    if(post === "/recipes"){
        await  deleteRecipe(slug)
     }else{
        await deleteBlog(slug)
     }
     toast.success("Deleted successfully")
    }

  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Render a button that opens the dialog. stopPropagation prevents the parent DropdownMenu from immediately closing */}
      <Button
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Trash />
        <span>Delete</span>
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The post and all associated comments, likes, and media will be permanently deleted and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await handleDelete();
              setOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}



export default DeleteWarning;