import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

export async function getCurrentUser(): Promise<User | null> {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        return null;
    }
    
    return user;
}

export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}
