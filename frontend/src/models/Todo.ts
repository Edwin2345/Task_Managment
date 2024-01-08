export interface Todo{
    id?: number,
    title: string,
    description: string,
    assignedToId?: number,
    username?: string,
    startDate: string,
    endDate: string,
    completed: boolean,
}