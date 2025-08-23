import z from 'zod'

export const SettingProfileSchema = z.object({
    image_url: z.string().optional(),
    full_name: z.string(),
    username: z.string(),
    bio: z.string(),
})


export const ChangeEmailSchema = z.object({
    email: z.string().email()
})