export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'Todo' | 'In progress' | 'Done';
}

export type CreateTaskData = Omit<Task, 'id'>;
export type UpdateTaskData = Omit<Task, 'id'>;
