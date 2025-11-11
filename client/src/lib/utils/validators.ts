/**
 * Validadores con Zod para formularios
 */

import { z } from 'zod';

// Validador de email
export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Email inválido');

// Validador de password
export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
  );

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Schema para registro
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  documentNumber: z.string().min(5, 'El número de documento es inválido'),
  documentType: z.enum(['CC', 'CE', 'TI'], {
    message: 'Tipo de documento inválido',
  }),
  phone: z
    .string()
    .regex(/^\+57\d{10}$/, 'El teléfono debe tener el formato +57XXXXXXXXXX'),
  companyId: z.string().uuid('ID de empresa inválido'),
});

// Schema para reset password
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// Types inferidos de los schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
