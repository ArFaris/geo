'use client';
import Loader from "@/components/ui/Loader";
import Text from "@/components/ui/Text";
import styles from './LoadingScreen.module.scss';
import { useEffect } from "react";
import cn from 'classnames';

const LoadingScreen = ({className, locale}: {className?: string, locale?: 'ru' | 'en'}) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className={cn(styles.loading, className)}>
                <Loader />
                <Text view='subtitle'>{locale === 'ru' ? 'Загрузка...' : 'Loading...'}</Text>
        </div>
    )
}

export default LoadingScreen;
