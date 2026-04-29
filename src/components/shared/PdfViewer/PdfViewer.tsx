'use client';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import s from './PdfViewer.module.scss';
import Text from '@/components/ui/Text';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Button from '@/components/ui/Button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PdfViewer = ({ pdfPath }: { pdfPath: string | null }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.2);
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
    if (isLoading) return <LoadingScreen />;

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
    const resetZoom = () => setScale(1.2);

    return (
        <section className={s.container}>
            {numPages > 0 && (
                <div className={s.controls}>
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
                </div>
            )}

            <div className={s.wrapper}>
                {proxiedUrl && (
                    <Document
                        file={proxiedUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={<LoadingScreen />}
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
