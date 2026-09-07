/**
 * Single role today (Super Admin has full access), but modeled as an enum
 * so Phase 2 roles (Branch Manager, Kitchen Staff) are additive — no
 * existing values or shapes need to change.
 */
export const AdminRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}
