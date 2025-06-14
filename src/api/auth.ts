import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export const fetchUser = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching user session:", error);
    return null;
  }

  return data?.session?.user || null;
};

export const signUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return error;
};

export const getSessionUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error checking login status:", error);
    return null;
  }
  return data?.session?.user || null;
};
