'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    const role = user?.user_metadata?.role || user?.app_metadata?.role;
    console.log('[isAdmin] user:', user?.email, 'role:', role);
    return role === 'admin';
}

// ============================================================================
// ПОЛУЧЕНИЕ ДАННЫХ
// ============================================================================

export async function getSources() {
    console.log('[getSources] START');
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[getSources] ERROR:', error);
        return [];
    }

    console.log('[getSources] SUCCESS, count:', data.length);
    return data;
}

export async function getPartners() {
    console.log('[getPartners] START');
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[getPartners] ERROR:', error);
        return [];
    }

    console.log('[getPartners] SUCCESS, count:', data.length);
    return data;
}

// ============================================================================
// CRUD ДЛЯ ИСТОЧНИКОВ
// ============================================================================

export async function createSource(formData: FormData) {
    console.log('[createSource] START');
    
    const admin = await isAdmin();
    console.log('[createSource] isAdmin:', admin);
    
    if (!admin) {
        return { error: 'Unauthorized: admin access required' };
    }

    const name = formData.get('name') as string;
    const name_en = formData.get('name_en') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string || null;
    const description_en = formData.get('description_en') as string || null;

    console.log('[createSource] Data:', { name, name_en, link });

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('sources')
        .insert({ name, name_en, link, description, description_en })
        .select()
        .single();

    if (error) {
        console.error('[createSource] Supabase error:', error);
        return { error: error.message };
    }

    console.log('[createSource] Supabase response data:', data);
    console.log('[createSource] SUCCESS');

    revalidatePath('/sources');
    revalidatePath('/profile');
    
    return { success: true, data };
}

export async function updateSource(id: string, formData: FormData) {
    console.log('[updateSource] START, id:', id);
    
    if (!(await isAdmin())) {
        console.error('[updateSource] Unauthorized');
        return { error: 'Unauthorized: admin access required' };
    }

    const supabase = await createClient();

    const name = formData.get('name') as string;
    const name_en = formData.get('name_en') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string || null;
    const description_en = formData.get('description_en') as string || null;

    console.log('[updateSource] Data:', { id, name, name_en, link });

    const { error } = await supabase
        .from('sources')
        .update({ name, name_en, link, description, description_en })
        .eq('id', id);

    if (error) {
        console.error('[updateSource] Supabase error:', error);
        return { error: `Database error: ${error.message}` };
    }

    console.log('[updateSource] SUCCESS');
    revalidatePath('/sources');
    revalidatePath('/profile');
    return { success: true };
}

export async function deleteSource(id: string) {
    console.log('[deleteSource] START, id:', id);
    
    if (!(await isAdmin())) {
        console.error('[deleteSource] Unauthorized');
        return { error: 'Unauthorized: admin access required' };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[deleteSource] Supabase error:', error);
        return { error: `Database error: ${error.message}` };
    }

    console.log('[deleteSource] SUCCESS');
    revalidatePath('/sources');
    revalidatePath('/profile');
    return { success: true };
}

// ============================================================================
// CRUD ДЛЯ ПАРТНЕРОВ
// ============================================================================

export async function createPartner(formData: FormData) {
    console.log('[createPartner] START');
    
    const admin = await isAdmin();
    console.log('[createPartner] isAdmin:', admin);
    
    if (!admin) {
        console.error('[createPartner] Unauthorized - not admin');
        return { error: 'Unauthorized: admin access required' };
    }

    const name = formData.get('name') as string;
    const name_en = formData.get('name_en') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string || null;
    const description_en = formData.get('description_en') as string || null;

    console.log('[createPartner] Data:', { name, name_en, link });

    if (!name || !name_en || !link) {
        console.error('[createPartner] Validation failed');
        return { error: 'Missing required fields: name, name_en, link' };
    }

    const supabase = await createClient();
    console.log('[createPartner] Supabase client created');

    const { data, error } = await supabase
        .from('partners')
        .insert({ name, name_en, link, description, description_en })
        .select()
        .single();

    if (error) {
        console.error('[createPartner] Supabase error:', error);
        console.error('[createPartner] Error code:', error.code);
        console.error('[createPartner] Error message:', error.message);
        return { error: `Database error: ${error.message}` };
    }

    console.log('[createPartner] SUCCESS, id:', data.id);
    revalidatePath('/partners');
    revalidatePath('/profile');
    return { success: true, data };
}

export async function updatePartner(id: string, formData: FormData) {
    console.log('[updatePartner] START, id:', id);
    
    if (!(await isAdmin())) {
        return { error: 'Unauthorized: admin access required' };
    }

    const supabase = await createClient();

    const name = formData.get('name') as string;
    const name_en = formData.get('name_en') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string || null;
    const description_en = formData.get('description_en') as string || null;

    const { error } = await supabase
        .from('partners')
        .update({ name, name_en, link, description, description_en })
        .eq('id', id);

    if (error) {
        console.error('[updatePartner] Supabase error:', error);
        return { error: `Database error: ${error.message}` };
    }

    console.log('[updatePartner] SUCCESS');
    revalidatePath('/partners');
    revalidatePath('/profile');
    return { success: true };
}

export async function deletePartner(id: string) {
    console.log('[deletePartner] START, id:', id);
    
    if (!(await isAdmin())) {
        return { error: 'Unauthorized: admin access required' };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[deletePartner] Supabase error:', error);
        return { error: `Database error: ${error.message}` };
    }

    console.log('[deletePartner] SUCCESS');
    revalidatePath('/partners');
    revalidatePath('/profile');
    return { success: true };
}