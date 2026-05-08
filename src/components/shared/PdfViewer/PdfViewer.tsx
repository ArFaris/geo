'use client';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import s from './PdfViewer.module.scss';
import Text from '@/components/ui/Text';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Button from '@/components/ui/Button';
import cn from 'classnames';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

type PdfViewerProps = {
    pdfPath: string | null;
    locale: 'en' | 'ru';
    isFullScreen: boolean;
    setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PdfViewer = ({ pdfPath, locale, isFullScreen, setIsFullScreen }: PdfViewerProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(isFullScreen ? 1.6 : 1.2);
    const [proxiedUrl, setProxiedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (pdfPath) {
            setIsLoading(true);
            const proxyUrl = `/api/pdf?path=${encodeURIComponent(pdfPath)}`;
            setProxiedUrl(proxyUrl);
            setIsLoading(false);
        }
    }, [pdfPath]);

    if (!pdfPath) return null;
    if (isLoading) return <LoadingScreen locale={locale}/>;

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
    const resetZoom = () => setScale(isFullScreen ? 1.6 : 1.2);

    return (
        <section className={s.container}>
            {numPages > 0 && (
                <div className={cn(s.controls, isFullScreen && s.controls__full)}>
                    <Button view='light' onClick={zoomOut} className={s.controlBtn} title="Уменьшить">
                        −
                    </Button>
                    <Text color='primary' className={s.zoomPercent}>{Math.round(scale * 100)}%</Text>
                    <Button view='light' onClick={zoomIn} className={s.controlBtn} title="Увеличить">
                        +
                    </Button>
                    <Button view='light' onClick={resetZoom} className={s.controlBtn} title="Сбросить масштаб">
                        ↺
                    </Button>
                    {isFullScreen &&
                        <Button view='light' onClick={() => setIsFullScreen(false)} className={s.controlBtn} title="Закрыть расширенный PDF">
                            ✕
                        </Button>}
                </div>
            )}

            {isFullScreen && <div className='overlay'></div>}

            <div className={cn(s.wrapper, isFullScreen && s.wrapper__full)}>
                {proxiedUrl && (
                    <Document
                        file={proxiedUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={<LoadingScreen locale={locale}/>}
                        error={<Text view='subtitle'>Ошибка загрузки файла. Попробуйте позже</Text>}
                    >
                        {Array.from(new Array(numPages), (_, index) => (
                            <Page
                                key={index}
                                pageNumber={index + 1}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={true}
                            />
                        ))}
                    </Document>
                )}
            </div>
        </section>
    );
}

export default PdfViewer;
