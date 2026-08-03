import z from 'zod'

export const SettingProfileSchema = z.object({
    image_url: z.string().optional(),
    full_name: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name must be less than 50 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    bio: z.string().max(500, "Bio must be less than 500 characters"),
})

export const ChangeEmailSchema = z.object({
    email: z.string().email()
})