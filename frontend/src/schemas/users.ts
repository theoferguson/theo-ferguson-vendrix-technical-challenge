import { nullable, z } from 'zod';
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 *
 * @docs  https://github.com/colinhacks/zod#strings
 * TODO: Adjust the "User" schema below to whatever you think makes sense.
 * No adjustments needed for any other schema
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/**
 * * *******************
 *    DB Models
 * * *******************
 */
export const userRoles = [
  'Controller',
  'Administrator',
  'Base',
] as const;

const userRoleSchema = z.enum(userRoles);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * @summary     Schema for a "user" entity type
 */

export const User = z.object({
  _id: z.string().uuid(),
  role: userRoleSchema,
  name: z.object({
    familyName: z.string().min(3).max(30),
    givenName: z.string().min(2).max(25),
    middleName: z.string().max(15).optional(),
    suffix: z.string().max(5).optional(),
    title: z.string().max(5).optional(),
  }),
  email: z.string().email(),
  phone: z.string().min(10).max(13).transform(data => Number(data)).optional(),
  password: z.string().min(4).max(20),
  confirmPassword: z.string().min(4).max(20),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Password and Password Confirmation should be equal",
  path: ["confirmPassword"],
}).innerType();

export type User = z.infer<typeof User>;

// ----------------------------------------------------------------------

/**
 * * *******************
 *    Mutations
 * * *******************
 */
export const createUserSchema = User.pick({
  role: true,
  name: true,
  email: true,
  phone: true,
  password: true,
  confirmPassword: true,
});
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = User.pick({
  role: true,
  name: true,
  email: true,
  phone: true,
  password: true,
  confirmPassword: true,
}).partial();
export type UpdateUser = z.infer<typeof updateUserSchema>;

// ----------------------------------------------------------------------

/**
 * * *******************
 *    Default Values
 * * *******************
 */

export const defaultValuesUser = (): CreateUser => ({
  role: 'Base',
  name: {
    familyName: '',
    givenName: '',
    middleName: undefined,
    suffix: undefined,
    title: undefined,
  },
  email: '',
  phone: undefined,
  password: '',
  confirmPassword: '',
});
