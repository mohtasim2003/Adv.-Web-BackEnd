//import all from 'class-validator';
/*
Name Must not contain any special character
• Password field must be at least 6 character long and it must contain one
Lowercase character
• Validate the file uploaded is in PDF format
• Phone Number field must start with 01*/


export class AdminDTO {
    id: number;
    name: string;
    password: string;
}