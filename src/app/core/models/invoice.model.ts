import { User } from "./user.model";

export class Invoice{
    invoiceId?: number;
    invoiceDateOfIssue?: String;
    invoiceDiscount?: number;
    invoiceTotal?: number;
    invoicePayByDate?: String;
    invoicePaidDate?: String;
    invoicePaidFlag?: boolean;
    user?: User;
    adminId?: String;
}