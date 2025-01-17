import { z } from "zod";
import { Serializable } from "./types.js";
import { randomUUID } from "crypto";

export const TeacherCreationSchema = z.object({
    firstName: z.string(),
    surname: z.string(),
    phone: z.string(),
    email: z.string().email(),
    document: z.string(),
    salary: z.number().min(1),
    hiringDate: z.string().datetime().refine((date: string) => !isNaN(new Date(date).getTime())),
    major: z.string(),
    id: z.string().uuid().optional(),
})

export type TeacherCreationType = z.infer<typeof TeacherCreationSchema>
export const TeacherUpdateSchema = TeacherCreationSchema.partial().omit({ id: true })
export type TeacherUpdateType = z.infer<typeof TeacherCreationSchema>

export class Teacher implements Serializable {

    firstName: TeacherCreationType['firstName']
    surname: TeacherCreationType['surname']
    phone: TeacherCreationType['phone']
    email: TeacherCreationType['email']
    document: TeacherCreationType['document']
    salary: TeacherCreationType['salary']
    hiringDate: Date
    major: TeacherCreationType['major']
    readonly id: string

    constructor(data: TeacherCreationType) {

        const parsedData = TeacherCreationSchema.parse(data)

        this.firstName = parsedData.firstName
        this.surname = parsedData.surname
        this.phone = parsedData.phone
        this.email = parsedData.email
        this.document = parsedData.document
        this.salary = parsedData.salary
        this.hiringDate = new Date
        this.major = parsedData.major
        this.id = parsedData.id ?? randomUUID()
    }

    static fromObject(data: Record<string, unknown>) {
        const parsed = TeacherCreationSchema.parse(data)
        return new Teacher(parsed)
    }
    toJson(): string {
        return JSON.stringify(this.toObject())
    }
    toObject(): Record<string, unknown> {
        return {
            id: this.id,
            firstName: this.firstName,
            surname: this.surname,
            phone: this.phone,
            email: this.email,
            document: this.document,
            salary: this.salary,
            hiringDate: this.hiringDate.toISOString(),
            major: this.major,
        }
    }
}