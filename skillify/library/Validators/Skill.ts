import { z } from 'zod';

export class SkillValidator {
  public static Skill = z
    .string()
    .regex(/^(?=.*\S\S)[a-zA-Z0-9\s]*$/)
    .min(2)
    .max(50);
}
