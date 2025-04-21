import { z } from 'zod';

export class UserValidator {
  public static Email = z.string().email();

  public static Username = z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]{3,30}$/);

  public static Name = z
    .string()
    .regex(/^[a-zA-Z ]+$/)
    .min(3)
    .max(50);
}
