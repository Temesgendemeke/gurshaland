export interface Profile{
    id?: string;
    image?: {
        id?: string;
        url?: string;
        profile_id?: string;
    };
    full_name: string;
    username: string;
    bio: string;
}

