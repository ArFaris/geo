import { z } from 'zod';

export const UserSchema = z.object({
    name: z.string().min(2, 'The name must consist of at least two characters'),
    email: z.email('Uncorrected email'),
    password: z.string()
                .min(6, 'The minimum password length is 6 characters')
                .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
                .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
                .regex(/[0-9]/, 'Password must contain at least one digit')
                .regex(/[!@#$%^&*()_+\-={};':"\\|,.<>/?]/, 'Password must contain at least one special character'),
});
