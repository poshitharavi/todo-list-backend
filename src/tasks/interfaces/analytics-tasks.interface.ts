export interface TaskAnalytics {
  userId: number;
  userName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  expiredTasks: number;
  completionPercentage: number;
}
