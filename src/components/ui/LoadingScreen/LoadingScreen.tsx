'use client';
import Loader from "@/components/ui/Loader";
import Text from "@/components/ui/Text";
import styles from './LoadingScreen.module.scss';
import { useEffect } from "react";
import cn from 'classnames';

const LoadingScreen = ({className}: {className?: string}) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className={cn(styles.loading, className)}>
                <Loader />
                <Text view='subtitle'>Загрузка...</Text>
        </div>
    )
}

export default LoadingScreen;
