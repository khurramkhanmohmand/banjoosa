/**
 * A physical restaurant location. Phase 1 runs a single branch, but every
 * order/menu-item-facing entity already carries a branchId so Phase 2
 * (multi-branch) is additive rather than a schema rewrite.
 */
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  isActive: boolean;
}
