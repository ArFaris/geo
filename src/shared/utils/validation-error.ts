import type { ZodError } from "zod";

export const validation = (error: ZodError) => {
    const fieldErrors: Record<string, string> = {};

    error.issues.forEach(err => {
        fieldErrors[err.path[0].toString()] = err.message;
    });

    return fieldErrors;
}
