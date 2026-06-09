'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth/server';

async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    const role = user?.user_metadata?.role || user?.app_metadata?.role;
    return role === 'admin';
}

export async function getUsers() {
    // Проверяем права админа через обычный клиент
    if (!(await isAdmin())) {
        return { error: 'Unauthorized', users: [] };
    }
    
    // Для получения списка пользователей используем adminClient
    const supabase = createAdminClient();
    
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
        console.error('Ошибка получения пользователей:', error);
        return { error: error.message, users: [] };
    }
    
    const users = data.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '—',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
    }));
    
    return { users, error: null };
}