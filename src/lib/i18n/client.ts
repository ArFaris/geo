'use client';
import { createT as createTCore } from './core';

export function createClientT(locale: 'ru' | 'en') {
    return createTCore(locale);
}
