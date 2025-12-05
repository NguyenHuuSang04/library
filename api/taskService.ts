
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task';

const API_URL = 'https://6832d64fc3f2222a8cb3da6f.mockapi.io/api/v1/Task_2';


export const taskAPI = {

    async getTasks(): Promise<Task[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    },


    async getTaskById(id: string): Promise<Task> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch task');
        }
        return response.json();
    },


    async createTask(data: CreateTaskData): Promise<Task> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        return response.json();
    },


    async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        return response.json();
    },


    async deleteTask(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
    },
};