"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import RestaurantForm from "./RestaurantForm"
import RestaurantSchema, { getRestaurentSchema, GetRestaurentType } from "@/schema/restaurent"
import { RestaurantFormType } from "@/schema/restaurent"
import { useForm, UseFormRegisterReturn } from "react-hook-form"
import PreviewSection from "./PreviewSection"
import { toast } from "sonner"
import generate_error from "@/utils/generate_error"
import { updateRestaurant } from "@/actions/restaurant/crud"
import { useRouter } from "next/router"

const EditRestaurantForm = ({ restaurant }: { restaurant: GetRestaurentType }) => {
    const router = useRouter()

    const form = useForm<GetRestaurentType>({
        resolver: zodResolver(getRestaurentSchema),
        defaultValues: {
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant?.address || "",
            phone: restaurant?.phone || "",
            email: restaurant?.email || "",
            website: restaurant?.website || "",
            cuisine: restaurant?.cuisine || "",
            description: restaurant?.description || "",
            image: {
                id: restaurant?.image?.id || "",
                url: restaurant?.image?.url || "",
                path: restaurant?.image?.path || "",
                file: restaurant?.image?.file || "",
            },
            google_map_url: restaurant?.google_map_url || "",
            menu: restaurant?.menu || [],
            gallery: restaurant?.gallery || [],
            reviews: restaurant?.reviews || [],
        },
    })

    const onSubmit = async (data: any) => {
        try {
            const restaurant = await updateRestaurant(data)
            toast.success('Restaurant updated successfully')
            if (restaurant?.slug) {
                router.push(`/restaurant/${restaurant?.slug}`)
            }
        } catch (error) {
            toast.error(generate_error(error))
        }
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full bg-background text-card-foreground max-w-7xl mx-auto">
            <div className="lg:col-span-7">
                <RestaurantForm form={form} onSubmit={onSubmit} mode="edit" />
            </div>
            <div className="hidden lg:block lg:col-span-5 relative">
                <div className="sticky top-24 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Preview</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border overflow-hidden transform transition-all hover:scale-[1.01]">
                        <PreviewSection form={form} onSubmit={onSubmit} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default EditRestaurantForm;