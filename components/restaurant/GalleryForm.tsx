import { RestaurantFormType } from "@/schema/restaurent"
import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, Trash, Trash2, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageBox from "@/components/ImageBox"
import { useFieldArray } from "react-hook-form"

const GalleryForm = ({form}: {form: UseFormReturn<RestaurantFormType>}) => {
    const {
        fields: galleryFields,
        append: appendGallery,
        remove: removeGallery,
      } = useFieldArray({
        control: form.control,
        name: "gallery",
      });



    //  delete from db and storage
    const delelteImage = async(path: string) => {
      
    } 

    
    
    return (
        <Card className="bg-background">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-primary mb-1">
                        <UtensilsCrossed className="h-5 w-5" />
                        <span className="font-semibold uppercase tracking-wider text-xs mt-2">Gallery</span>
                      </div>
                      <CardTitle>Gallery</CardTitle>
                      <CardDescription>
                        Add your gallery images to entice customers.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant={'outline'}
                      onClick={() => appendGallery({})}
                      className="gap-2 shadow-sm"
                    >
                      <PlusIcon size={18} />
                      Add Item
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4 ">
                    {galleryFields.map((gallery, index) => (
                      <div key={gallery.id} className="relative">
                        <ImageBox form={form} inputcls={`gallery-image-${index}`} field={`gallery.${index}` as any} label={`Gallery ${index + 1}`}  deleteImage={delelteImage}/>
                        <Button type="button" onClick={() => removeGallery(index)} className="absolute top-6 right-6 z-10 " variant={'outline'}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
    )
}


export default GalleryForm;