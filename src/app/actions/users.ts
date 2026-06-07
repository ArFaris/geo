'use server';

import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/auth/server';

async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    const role = user?.user_metadata?.role || user?.app_metadata?.role;
    return role === 'admin';
}

// ============================================================================
// ПОЛУЧЕНИЕ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (только для админа)
// ============================================================================

export async function getUsers() {
    // Проверка прав администратора
    if (!(await isAdmin())) {
        console.error('Unauthorized: admin access required');
        return { error: 'Unauthorized: admin access required', users: [] };
    }

    // Создаём админ-клиент с service_role ключом
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error('Ошибка получения пользователей:', error);
        return { error: error.message, users: [] };
    }

    // Возвращаем нужные поля
    const users = data.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '—',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
    }));

    return { users, error: null };
}