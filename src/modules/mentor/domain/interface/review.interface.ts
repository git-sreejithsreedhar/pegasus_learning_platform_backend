export interface Review {
  reviewerId: string;
  reviewerName?: string;
  sessionId?: string;
  comment: string;
  rating: number;
  createdAt: Date;
}
