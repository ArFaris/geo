'use client';
import { createClient } from '@/lib/supabase/client';

export const loginUser = async (email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

export const updateUser = async (params: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    email: params.email,
    password: params.password,
    data: params.name ? { name: params.name } : undefined,
  });

  if (error) throw new Error(error.message);
  return data;
};

export const signOutUser = async () => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
};

export const getCurrentUser = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data.user;
};

export const resetPassword = async (email: string) => {
    const supabase = createClient();
    
    const redirectTo = `https://geo-d7.vercel.app/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    });
    
    return { error: error?.message || null };
};

export const updatePassword = async (newPassword: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    
    if (error) {
        return { error: error.message };
    }
    
    return { error: null };
};
