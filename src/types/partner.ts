export interface PartnerUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "partner_request" | "partner";
  status:
    | "active"
    | "pending"
    | "suspended"
    | "pending_approval"
    | "approved"
    | "rejected";
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerCourse {
  _id: string;
  title: string;
  description?: string;
  price: number;
  priceType?: "free" | "paid";
  thumbnailUrl?: string;
  instructor?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerLesson {
  _id: string;
  title: string;
  contentType: "video" | "audio" | "pdf";
  contentUrl: string;
  durationSeconds?: number;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerEvent {
  _id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  capacity?: number;
  bookedCount?: number;
  status: "draft" | "published" | "completed" | "canceled";
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerDashboardStats {
  totalCourses: number;
  totalLearners: number;
  totalRevenue: number;
  monthlyRevenue: Array<{ month: string; amount: number }>;
  upcomingEvents: PartnerEvent[];
  pendingApprovalsCount: number;
}

export interface PartnerTransaction {
  _id: string;
  type: "earning" | "withdrawal";
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  meta?: Record<string, any>;
}

export interface PartnerEarnings {
  totalEarnings: number;
  availableBalance: number;
  monthlyEarnings: Array<{ month: string; amount: number }>;
  transactions: PartnerTransaction[];
}

export interface PartnerNotification {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
  type?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

export interface PaginatedResponse<T> extends PaginationMeta {
  records: T[];
}

export interface ResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}
