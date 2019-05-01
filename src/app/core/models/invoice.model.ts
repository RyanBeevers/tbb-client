export class Invoice{
    customerId?: number;
    invoiceId?: number;
    invoiceDateOfIssue?: Date;
    invoiceDiscount?: number;
    invoiceTotal?: number;
    invoicePayByDate?: Date;
    invoicePaidDate?: Date;
    invoicePaidFlag?: boolean;
    taskIds?: Array<number>;
}