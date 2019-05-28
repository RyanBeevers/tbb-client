import { User } from "./user.model";
import { Invoice } from "./invoice.model";

export class Task{
    taskId?: number;
    taskName?: string;
    taskDesc?: string;
    taskSubmittedDate?: String;
    taskDueDate?: String;
    taskStatus?: string;
    taskEstimatedCost?: number;
    taskFinalCost?: number;
    taskEstimatedEffort?: number;
    taskActualEffort?: number;
    taskCostPerHour?: number;
    taskCompletedDate?: String;
    user?: User;
    invoice?: Invoice;
    adminId?: String;
}