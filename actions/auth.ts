import { supabase } from "@/lib/supabase-client";
import { SignUpData } from "@/utils/types/account";

export const signup = async (formData: SignUpData) => {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        username: formData.username,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const login = async (email: string, password: string) => {
  console.log(email, password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

export const logout = async () => {
  const error = await supabase.auth.signOut();

  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
  });
  if (error) throw error;
};

export const changePassword = async (new_password: string) => {
  const { error } = await supabase.auth.updateUser({
    password: new_password,
  });
  if (error) throw error;
};
