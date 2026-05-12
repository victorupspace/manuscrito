export type WritingTask = {
  id: string;
  userId: string;
  projectId: string | null;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};
