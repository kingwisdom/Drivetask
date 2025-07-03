export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string | null;
    isComplete: boolean;
    notificationId?: string; // NEW
}


export const createEmptyTask = (): Task => ({
    id: Date.now().toString(),
    title: '',
    description: '',
    dueDate: null,
    isComplete: false,
});