export type WaitlistRequestStatus = "pending" | "approved" | "rejected";

export type WaitlistRequest = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: WaitlistRequestStatus;
  createdAt: string;
  decidedAt: string | null;
  decidedBy: string | null;
};

export type CustomerStatus = "active" | "suspended" | "removed";

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: CustomerStatus;
  createdAt: string;
  plan: SubscriptionPlan | null;
};

export type SubscriptionPlan = "free" | "solo" | "studio" | "atelier";

export type Subscription = {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  plan: SubscriptionPlan;
  status: "active" | "trialing" | "canceled" | "past_due";
  startedAt: string;
  renewsAt: string | null;
};

export type EditorPermission = "viewer" | "commenter" | "editor";

export type EditorInviteStatus = "pending" | "approved" | "rejected" | "revoked";

export type EditorInvite = {
  id: string;
  masterUserId: string;
  masterUserName: string;
  masterUserEmail: string;
  editorEmail: string;
  permission: EditorPermission;
  status: EditorInviteStatus;
  createdAt: string;
  decidedAt: string | null;
};

export type ServiceResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string };
