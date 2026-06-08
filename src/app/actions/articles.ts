'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';

const s3Client = new S3Client({
    region: 'ru-central-1',
    endpoint: process.env.YANDEX_ENDPOINT,
    credentials: {
        accessKeyId: process.env.YANDEX_ACCESS_KEY_ID!,
        secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY!,
    },
});

async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    const role = user?.user_metadata?.role || user?.app_metadata?.role;
    return role === 'admin';
}

// ============================================================================
// СЧЁТЧИК ПРОСМОТРОВ
// ============================================================================

export async function incrementArticleViewsAction(articleId: string) {
    // Проверяем, не админ ли
    const user = await getCurrentUser();
    const isAdminUser = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';
    
    if (isAdminUser) {
        console.log('[incrementArticleViewsAction] Admin view ignored for:', articleId);
        return;
    }
    
    const cookieStore = await cookies();
    const viewedKey = `viewed_${articleId}`;

    if (cookieStore.get(viewedKey)) {
        return;
    }

    const supabase = await createClient();
    const { error } = await supabase.rpc('increment_views', {
        article_id: articleId,
    });

    if (error) {
        console.error('Ошибка обновления просмотров:', error);
        return;
    }

    cookieStore.set(viewedKey, 'true', {
        maxAge: 60 * 60 * 24,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    
    console.log('[incrementArticleViewsAction] View counted for:', articleId);
}

export async function incrementArticleDownloadsAction(articleId: string) {
    // Проверяем, не админ ли
    const user = await getCurrentUser();
    const isAdminUser = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';
    
    if (isAdminUser) {
        console.log('[incrementArticleDownloadsAction] Admin download ignored for:', articleId);
        return;
    }
    
    const supabase = await createClient();
    
    const { error } = await supabase.rpc('increment_downloads', {
        article_id: articleId,
    });

    if (error) {
        console.error('Ошибка обновления скачиваний:', error);
    } else {
        console.log('[incrementArticleDownloadsAction] Download counted for:', articleId);
    }
}

// ============================================================================
// CRUD ДЛЯ СТАТЕЙ
// ============================================================================

export async function createArticle(formData: FormData) {
    console.log('=== CREATE ARTICLE START ===');
    
    try {
        // 1. Проверка прав администратора
        console.log('Checking admin rights...');
        if (!(await isAdmin())) {
            console.error('Unauthorized: user is not admin');
            return { error: 'Unauthorized: admin access required' };
        }
        console.log('Admin check passed');

        const supabase = await createClient();

        // 2. Извлечение данных из формы
        console.log('Extracting form data...');
        const title = formData.get('title') as string;
        const title_en = formData.get('title_en') as string || null;
        const category = formData.get('category') as string;
        const subcategory = formData.get('subcategory') as string || null;
        const part_raw = formData.get('part') as string || null;
        const reading_time_raw = formData.get('reading_time') as string || null;
        
        // Множественные секции и их подсекции
        const selectedSectionIds = JSON.parse(formData.get('selected_section_ids') as string || '[]');
        const selectedSubsections = JSON.parse(formData.get('selected_subsections') as string || '{}');

        console.log('Form data:', {
            title,
            title_en,
            category,
            subcategory,
            part_raw,
            reading_time_raw,
            selectedSectionIds,
            selectedSubsections,
        });

        // 3. Преобразование part в число (если есть)
        let part: number | null = null;
        if (part_raw) {
            const parsed = parseInt(part_raw, 10);
            if (!isNaN(parsed)) {
                part = parsed;
            }
        }

        // 4. Преобразование reading_time в число
        let reading_time: number | null = null;
        if (reading_time_raw) {
            const parsed = parseInt(reading_time_raw, 10);
            if (!isNaN(parsed) && parsed > 0) {
                reading_time = parsed;
            }
        }

        console.log('Parsed values:', { part, reading_time });

        // 5. Создание статьи в Supabase
        console.log('Creating article in Supabase...');
        const { data: article, error } = await supabase
            .from('articles')
            .insert({
                title: title?.trim(),
                title_en: title_en?.trim(),
                category,
                subcategory: category === 'articles' ? subcategory : null,
                part: part,
                reading_time: reading_time,
                views: 0,
                pdf_path: 'pending', 
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return { error: `Database error: ${error.message}` };
        }

        if (!article) {
            console.error('No article returned from Supabase');
            return { error: 'Failed to create article: no data returned' };
        }

        console.log('Article created successfully:', { id: article.id, title: article.title });

        // 6. Добавление связей с секциями
        if (selectedSectionIds.length > 0) {
            console.log('Adding section links...');
            const sectionLinks = selectedSectionIds.map((sectionId: string) => ({
                article_id: article.id,
                section_id: sectionId,
                subsection_id: selectedSubsections[sectionId] || null,
            }));
            
            const { error: sectionError } = await supabase
                .from('article_sections')
                .insert(sectionLinks);

            if (sectionError) {
                console.error('Error adding section links:', sectionError);
            } else {
                console.log('Section links added successfully');
            }
        }

        // 7. Загрузка PDF в Yandex Cloud
        const pdfFile = formData.get('pdf') as File;
        if (pdfFile && pdfFile.size > 0) {
            console.log('Uploading PDF to Yandex Cloud...', { fileName: `${article.id}.pdf`, size: pdfFile.size });
            const buffer = Buffer.from(await pdfFile.arrayBuffer());
            const fileName = `${article.id}.pdf`;

            try {
                await s3Client.send(new PutObjectCommand({
                    Bucket: process.env.YANDEX_BUCKET_NAME,
                    Key: fileName,
                    Body: buffer,
                    ContentType: 'application/pdf',
                }));

                console.log('PDF uploaded successfully');

                const { error: pdfUpdateError } = await supabase
                    .from('articles')
                    .update({ pdf_path: fileName })
                    .eq('id', article.id);

                if (pdfUpdateError) {
                    console.error('Error updating pdf_path:', pdfUpdateError);
                } else {
                    console.log('pdf_path updated in database');
                }
            } catch (s3Error) {
                console.error('S3 upload error:', s3Error);
            }
        } else {
            console.log('No PDF file to upload');
        }

        revalidatePath('/profile');
        revalidatePath('/articles');
        
        console.log('=== CREATE ARTICLE SUCCESS ===');
        return { success: true, article };

    } catch (error) {
        console.error('=== CREATE ARTICLE ERROR ===');
        console.error('Unexpected error:', error);
        return { error: 'An unexpected error occurred while creating the article' };
    }
}

export async function updateArticle(id: string, formData: FormData) {
    console.log('=== UPDATE ARTICLE START ===');
    console.log('[updateArticle] Article ID:', id);
    
    if (!(await isAdmin())) {
        console.error('[updateArticle] Unauthorized: admin access required');
        throw new Error('Unauthorized: admin access required');
    }
    console.log('[updateArticle] Admin check passed');

    const supabase = await createClient();

    // Получение данных из формы
    const title = formData.get('title') as string;
    const title_en = formData.get('title_en') as string || null;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string || null;
    const part = formData.get('part') as string || null;
    const reading_time = formData.get('reading_time') as string || null;
    
    // МНОЖЕСТВЕННЫЕ секции (массив)
    const selectedSectionIdsRaw = formData.get('selected_section_ids') as string || '[]';
    const selectedSubsectionsRaw = formData.get('selected_subsections') as string || '{}';
    
    console.log('[updateArticle] Raw form data:', {
        title,
        title_en,
        category,
        subcategory,
        part,
        reading_time,
        selectedSectionIdsRaw,
        selectedSubsectionsRaw,
    });
    
    let selectedSectionIds: string[] = [];
    let selectedSubsections: Record<string, string> = {};
    
    try {
        selectedSectionIds = JSON.parse(selectedSectionIdsRaw);
        selectedSubsections = JSON.parse(selectedSubsectionsRaw);
        console.log('[updateArticle] Parsed sections:', { selectedSectionIds, selectedSubsections });
    } catch (parseError) {
        console.error('[updateArticle] JSON parse error:', parseError);
    }

    // 1. Обновляем метаданные
    console.log('[updateArticle] Updating article metadata...');
    const { error: updateError } = await supabase
        .from('articles')
        .update({ 
            title, 
            title_en, 
            category, 
            subcategory: category === 'articles' ? subcategory : null, 
            part, 
            reading_time 
        })
        .eq('id', id);

    if (updateError) {
        console.error('[updateArticle] Metadata update error:', updateError);
        throw new Error(`Failed to update article: ${updateError.message}`);
    }
    console.log('[updateArticle] Metadata updated successfully');

    // 2. Обновляем связи с секциями (удаляем старые, вставляем новые)
    console.log('[updateArticle] Deleting old section links...');
    const { error: deleteError } = await supabase
        .from('article_sections')
        .delete()
        .eq('article_id', id);
    
    if (deleteError) {
        console.error('[updateArticle] Delete sections error:', deleteError);
    } else {
        console.log('[updateArticle] Old sections deleted');
    }
    
    if (selectedSectionIds.length > 0) {
        console.log('[updateArticle] Attempting to insert sections for article:', id);
        
        // 🔥 ВОТ ЗДЕСЬ ОПРЕДЕЛЯЕМ sectionLinks
        const sectionLinks = selectedSectionIds.map((sectionId: string) => ({
            article_id: id,
            section_id: sectionId,
            subsection_id: selectedSubsections[sectionId] || null,
        }));
        
        console.log('[updateArticle] Section links to insert:', JSON.stringify(sectionLinks, null, 2));
        
        const { error: insertError, data: insertedData } = await supabase
            .from('article_sections')
            .insert(sectionLinks)
            .select();
        
        if (insertError) {
            console.error('[updateArticle] Insert sections error:', {
                message: insertError.message,
                code: insertError.code,
                details: insertError.details
            });
        } else {
            console.log('[updateArticle] Sections inserted successfully:', insertedData);
            
            // Сразу проверяем, что вставилось
            const { data: verify } = await supabase
                .from('article_sections')
                .select('*')
                .eq('article_id', id);
            console.log('[updateArticle] Verification after insert:', verify);
        }
    } else {
        console.log('[updateArticle] No sections to add');
    }

    // 3. Обновляем PDF (если загружен новый)
    const pdfFile = formData.get('pdf') as File;
    if (pdfFile && pdfFile.size > 0) {
        console.log('[updateArticle] New PDF file detected, size:', pdfFile.size);
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        const fileName = `${id}.pdf`;

        try {
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.YANDEX_BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: 'application/pdf',
            }));
            console.log('[updateArticle] PDF uploaded to Yandex Cloud');
            
            const { error: pdfUpdateError } = await supabase
                .from('articles')
                .update({ pdf_path: fileName })
                .eq('id', id);
            
            if (pdfUpdateError) {
                console.error('[updateArticle] PDF path update error:', pdfUpdateError);
            } else {
                console.log('[updateArticle] PDF path updated in database');
            }
        } catch (s3Error) {
            console.error('[updateArticle] S3 upload error:', s3Error);
        }
    } else {
        console.log('[updateArticle] No new PDF file');
    }

    revalidatePath('/profile');
    revalidatePath('/articles');
    revalidatePath(`/articles/${id}`);
    
    console.log('=== UPDATE ARTICLE SUCCESS ===');
    return { success: true };
}

export async function deleteArticle(id: string) {
    if (!(await isAdmin())) {
        throw new Error('Unauthorized: admin access required');
    }

    const supabase = await createClient();

    // Удаляем PDF из Yandex Cloud
    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.YANDEX_BUCKET_NAME,
            Key: `${id}.pdf`,
        }));
    } catch (s3Error) {
        console.error('Ошибка удаления PDF:', s3Error);
    }

    // Удаляем связи
    await supabase.from('article_sections').delete().eq('article_id', id);

    // Удаляем статью
    const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Ошибка удаления статьи:', error);
        throw new Error('Failed to delete article');
    }

    revalidatePath('/profile');
    revalidatePath('/articles');
}

// ============================================================================
// ПОЛУЧЕНИЕ ДАННЫХ
// ============================================================================

export async function getArticles(page: number = 1, limit: number = 100) {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, title_en, category, subcategory, part, reading_time, views, downloads_count, created_at, pdf_path')
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Ошибка получения статей:', error);
        return [];
    }

    return data;
}

export async function getArticleById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Ошибка получения статьи:', error);
        return null;
    }

    return data;
}

export async function getStatistics() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, views, downloads_count')
        .order('views', { ascending: false });

    if (error) {
        console.error('Ошибка получения статистики:', error);
        return [];
    }

    return data;
}

export async function getSectionsWithSubsections() {
    const start = Date.now();
    console.log('[getSectionsWithSubsections] START');
    
    const supabase = await createClient();

    // Получаем все секции
    const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('id, name')
        .order('name');

    if (sectionsError) {
        console.error('Ошибка получения секций:', sectionsError);
        return [];
    }

    console.log(`[getSectionsWithSubsections] Got ${sections?.length || 0} sections in ${Date.now() - start}ms`);

    if (!sections || sections.length === 0) {
        return [];
    }

    // Получаем все подсекции одним запросом
    const { data: allSubsections, error: subsectionsError } = await supabase
        .from('subsections')
        .select('id, slug, title, section_id')
        .order('title');

    if (subsectionsError) {
        console.error('Ошибка получения подсекций:', subsectionsError);
        return [];
    }

    console.log(`[getSectionsWithSubsections] Got ${allSubsections?.length || 0} subsections in ${Date.now() - start}ms`);

    // Группируем подсекции по section_id
    const subsectionsBySection: Record<string, Array<{ id: string; slug: string; title: string }>> = {};
    
    for (const sub of allSubsections || []) {
        if (!subsectionsBySection[sub.section_id]) {
            subsectionsBySection[sub.section_id] = [];
        }
        subsectionsBySection[sub.section_id].push({
            id: sub.id,
            slug: sub.slug,
            title: sub.title,
        });
    }

    // Собираем результат
    const result = sections.map((section) => ({
        section_id: section.id,
        section_name: section.name,
        subsections: subsectionsBySection[section.id] || [],
    }));

    console.log(`[getSectionsWithSubsections] FINISH in ${Date.now() - start}ms`);
    return result;
}

export async function getArticleSections(articleId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('article_sections')
        .select('section_id, subsection_id')
        .eq('article_id', articleId);

    if (error) {
        console.error('Ошибка получения секций статьи:', error);
        return [];
    }

    return data;
}