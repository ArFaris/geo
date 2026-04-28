'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import s from './PdfViewer.module.scss';
import Text from '@/components/ui/Text';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Button from '@/components/ui/Button';

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const PdfViewer = ({ pdfUrl }: { pdfUrl: string | null}) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.2);

    if (!pdfUrl) return;

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
                <Document
                    file={pdfUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<LoadingScreen />}
                    error={<Text view='subtitle'>Ошибка загрузки файла. Попробуйте позже</Text>}
                >
                    {Array.from(new Array(numPages), (_, index) => (
                        <Page
                            pageNumber={index + 1}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={true}
                        />
                    ))}
                </Document>
            </div>
        </section>
    );
}

export default PdfViewer;
