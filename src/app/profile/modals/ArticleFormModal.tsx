'use client';
import { useState, useEffect } from 'react';
import { createArticle, updateArticle, getSectionsWithSubsections, getArticleSections } from '@/app/actions/articles';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import { ArticleForTable } from '@/types/articles';
import s from './modal.module.scss';
import cn from 'classnames';

type ArticleFormModalProps = {
    mode: 'create' | 'edit';
    initialData?: ArticleForTable;
    onClose: (changed?: boolean) => void;
    locale: 'ru' | 'en';
};

type Subsection = {
    id: string;
    slug: string;
    title: string;
};

type Section = {
    section_id: string;
    section_name: string;
    subsections: Subsection[] | undefined;
};

const CATEGORIES = [
    { value: 'articles', labelRu: 'Статьи', labelEn: 'Articles' },
    { value: 'analytics', labelRu: 'Аналитика', labelEn: 'Analytics' },
    { value: 'reviews', labelRu: 'Обзоры', labelEn: 'Reviews' },
    { value: 'news', labelRu: 'Новости', labelEn: 'News' },
];

export default function ArticleFormModal({ mode, initialData, onClose, locale }: ArticleFormModalProps) {
    const isEdit = mode === 'edit';
    
    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    
    const [title, setTitle] = useState(isEdit ? initialData?.name || '' : '');
    const [titleEn, setTitleEn] = useState(isEdit ? initialData?.name_en || '' : '');
    const [selectedCategory, setSelectedCategory] = useState<string>(isEdit ? initialData?.category || 'articles' : 'articles');
    const [part, setPart] = useState(isEdit ? initialData?.part || '' : '');
    
    const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
    const [selectedSubsections, setSelectedSubsections] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadData = async () => {
            const [sectionsData, articleSectionsData] = await Promise.all([
                getSectionsWithSubsections(),
                isEdit && initialData ? getArticleSections(initialData.id) : Promise.resolve(null),
            ]);

            setSections(sectionsData);

            if (articleSectionsData && articleSectionsData.length > 0) {
                const sectionIds = articleSectionsData.map(s => s.section_id);
                setSelectedSectionIds(sectionIds);

                const subsectionsMap: Record<string, string> = {};
                articleSectionsData.forEach(s => {
                    if (s.subsection_id) {
                        subsectionsMap[s.section_id] = s.subsection_id;
                    }
                });
                setSelectedSubsections(subsectionsMap);
            }
        };

        loadData();
    }, [isEdit, initialData?.id]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!title || title.trim().length < 3) {
            newErrors.title = 'Заголовок должен содержать минимум 3 символа';
        }
        
        if (!titleEn || titleEn.trim().length < 3) {
            newErrors.title_en = 'Английский заголовок должен содержать минимум 3 символа';
        }
        
        if (!selectedCategory) {
            newErrors.category = 'Выберите категорию';
        }
        
        if (!isEdit) {
            const pdfInput = document.querySelector('input[name="pdf"]') as HTMLInputElement;
            const pdfFile = pdfInput?.files?.[0];
            if (!pdfFile || pdfFile.size === 0) {
                newErrors.pdf = 'Загрузите PDF файл';
            }
        }
        
        if (part && part.trim().length > 0) {
            const parsed = parseInt(part, 10);
            if (isNaN(parsed)) {
                newErrors.part = 'Часть/раздел должна быть целым числом';
            }
        }
        
        for (const sectionId of selectedSectionIds) {
            const section = sections.find(s => s.section_id === sectionId);
            if (section?.subsections && section.subsections.length > 0) {
                if (!selectedSubsections[sectionId]) {
                    newErrors[`subsection_${sectionId}`] = `Выберите подраздел для секции "${section.section_name}"`;
                }
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('title_en', titleEn);
        formData.append('category', selectedCategory);
        if (part) formData.append('part', part);
        
        if (selectedSectionIds.length > 0) {
            formData.append('selected_section_ids', JSON.stringify(selectedSectionIds));
        }
        
        if (Object.keys(selectedSubsections).length > 0) {
            formData.append('selected_subsections', JSON.stringify(selectedSubsections));
        }
        
        const pdfInput = document.querySelector('input[name="pdf"]') as HTMLInputElement;
        if (pdfInput?.files?.[0]) {
            formData.append('pdf', pdfInput.files[0]);
        }
        
        try {
            if (isEdit && initialData) {
                await updateArticle(initialData.id, formData);
            } else {
                await createArticle(formData);
            }
            setLoading(false);
            onClose(true);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleSectionCheckboxChange = (sectionId: string, checked: boolean) => {
        if (checked) {
            setSelectedSectionIds([...selectedSectionIds, sectionId]);
        } else {
            setSelectedSectionIds(selectedSectionIds.filter(id => id !== sectionId));
            const newSubsections = { ...selectedSubsections };
            delete newSubsections[sectionId];
            setSelectedSubsections(newSubsections);
        }
    };

    const handleSubsectionChange = (sectionId: string, subsectionId: string) => {
        setSelectedSubsections({
            ...selectedSubsections,
            [sectionId]: subsectionId,
        });
        if (errors[`subsection_${sectionId}`]) {
            const newErrors = { ...errors };
            delete newErrors[`subsection_${sectionId}`];
            setErrors(newErrors);
        }
    };

    const getSubsectionLabel = (sub: Subsection): string => {
        if (locale === 'en') {
            return sub.title;
        }
        const subsectionMap: Record<string, string> = {
            'sea': 'Морская навигация',
            'aero': 'Аэронавигация',
            'land': 'Наземная навигация',
            'relative': 'Относительное позиционирование',
            'absolute': 'Абсолютное позиционирование',
        };
        return subsectionMap[sub.slug] || sub.slug;
    };

    const getLocalizedText = (ru: string, en: string) => locale === 'ru' ? ru : en;
    const titleText = isEdit 
        ? getLocalizedText('Редактировать статью', 'Edit article')
        : getLocalizedText('Создать новую статью', 'Create new article');
    const submitButtonText = isEdit 
        ? getLocalizedText('Сохранить', 'Save')
        : getLocalizedText('Создать', 'Create');

    return (
        <div className={cn(s.overlay, mode === 'edit' && 'overlay')} onClick={() => onClose(false)}>
            <div className={`${s.modal} ${s.large}`} onClick={e => e.stopPropagation()}>
                <div className={s.header}>
                    <Text view="title-small" weight="bold">
                        {titleText}
                    </Text>
                    <button className={s.close} onClick={() => onClose(false)}>✕</button>
                </div>

                <div className={s.content}>
                    <form onSubmit={handleSubmit} className={s.form} noValidate>
                        <div className={s.field}>
                            <label>{getLocalizedText('Заголовок (русский)', 'Title (Russian)')} *</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={errors.title ? s.errorInput : ''}
                            />
                            {errors.title && <span className={s.error}>{errors.title}</span>}
                        </div>

                        <div className={s.field}>
                            <label>{getLocalizedText('Заголовок (английский)', 'Title (English)')} *</label>
                            <input 
                                type="text" 
                                value={titleEn}
                                onChange={(e) => setTitleEn(e.target.value)}
                                className={errors.title_en ? s.errorInput : ''}
                            />
                            {errors.title_en && <span className={s.error}>{errors.title_en}</span>}
                        </div>

                        <div className={s.field}>
                            <label>{getLocalizedText('Категория', 'Category')} *</label>
                            <div className={s.radioGroup}>
                                {CATEGORIES.map(cat => (
                                    <label key={cat.value} className={s.radioLabel}>
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat.value}
                                            checked={selectedCategory === cat.value}
                                            onChange={(e) => {
                                                setSelectedCategory(e.target.value);
                                                setErrors(prev => ({ ...prev, category: '' }));
                                            }}
                                        />
                                        {getLocalizedText(cat.labelRu, cat.labelEn)}
                                    </label>
                                ))}
                            </div>
                            {errors.category && <span className={s.error}>{errors.category}</span>}
                        </div>

                        <div className={s.field}>
                            <label>{getLocalizedText('Часть/раздел', 'Part')}</label>
                            <input 
                                type="text" 
                                value={part}
                                onChange={(e) => setPart(e.target.value)}
                                className={errors.part ? s.errorInput : ''}
                            />
                            {errors.part && <span className={s.error}>{errors.part}</span>}
                        </div>

                        <div className={s.field}>
                            <label>{getLocalizedText('PDF файл', 'PDF file')} {!isEdit && '*'}</label>
                            <div className={s.fileInputWrapper}>
                                <input 
                                    type="file" 
                                    name="pdf" 
                                    id="pdf-upload"
                                    accept=".pdf" 
                                    className={s.fileInput}
                                    onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || '')}
                                />
                                <label htmlFor="pdf-upload" className={s.fileInputLabel}>
                                    {selectedFileName || (isEdit 
                                        ? getLocalizedText('Выбрать новый файл', 'Choose new file')
                                        : getLocalizedText('Выберите файл', 'Choose file'))}
                                </label>
                            </div>
                            {isEdit && (
                                <small className={s.hint}>
                                    {getLocalizedText('Оставьте пустым, чтобы не менять PDF', 'Leave empty to keep current PDF')}
                                </small>
                            )}
                            {errors.pdf && <span className={s.error}>{errors.pdf}</span>}
                        </div>

                        <div className={s.field}>
                            <label>{getLocalizedText('Секции', 'Sections')}</label>
                            <div className={s.checkboxGroup}>
                                {sections.map(section => (
                                    <label key={section.section_id} className={s.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            value={section.section_id}
                                            checked={selectedSectionIds.includes(section.section_id)}
                                            onChange={(e) => handleSectionCheckboxChange(section.section_id, e.target.checked)}
                                        />
                                        {section.section_name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {selectedSectionIds.map(sectionId => {
                            const section = sections.find(s => s.section_id === sectionId);
                            const hasSubsections = section?.subsections && section.subsections.length > 0;
                            
                            if (!hasSubsections) return null;
                            
                            return (
                                <div key={sectionId} className={`${s.field} ${s.subsectionField}`}>
                                    <label>
                                        {getLocalizedText('Подраздел для секции', 'Subsection for section')} {section?.section_name} *
                                    </label>
                                    <div className={s.radioGroup}>
                                        <label className={s.radioLabel}>
                                            <input
                                                type="radio"
                                                name={`subsection_${sectionId}`}
                                                value=""
                                                checked={!selectedSubsections[sectionId]}
                                                onChange={() => handleSubsectionChange(sectionId, '')}
                                            />
                                            {getLocalizedText('Не выбрано', 'Not selected')}
                                        </label>
                                        {section?.subsections?.map(sub => (
                                            <label key={sub.id} className={s.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name={`subsection_${sectionId}`}
                                                    value={sub.id}
                                                    checked={selectedSubsections[sectionId] === sub.id}
                                                    onChange={() => handleSubsectionChange(sectionId, sub.id)}
                                                />
                                                {getSubsectionLabel(sub)}
                                            </label>
                                        ))}
                                    </div>
                                    {errors[`subsection_${sectionId}`] && (
                                        <span className={s.error}>{errors[`subsection_${sectionId}`]}</span>
                                    )}
                                </div>
                            );
                        })}

                        <div className={s.buttons}>
                            <Button type="submit" view="dark" loading={loading}>
                                {submitButtonText}
                            </Button>
                            <Button type="button" view="dark" onClick={() => onClose(false)}>
                                {getLocalizedText('Отмена', 'Cancel')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}