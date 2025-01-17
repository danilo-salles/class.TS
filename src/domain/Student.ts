import { z } from "zod";
import { Serializable } from "./types.js";
import { randomUUID } from "crypto";

export const StudentCreationSchema = z.object({
    id: z.string().uuid().optional(),
    firstName: z.string(),
    surname: z.string(),
    document: z.string(),
    bloodType: z.string(),
    birthDate: z.string().datetime().refine((date: string) => !isNaN(new Date(date).getTime())),
    allergies: z.string().array().optional(),
    medications: z.string().array().optional(),
    startDate: z.string().datetime().refine((date: string) => !isNaN(new Date(date).getTime())),
    parent: z.string().uuid().array().nonempty(),
    class: z.string().uuid(),
})

export type StudentCreationType = z.infer<typeof StudentCreationSchema>
export const StudentUpdateSchema = StudentCreationSchema.partial().omit({ id: true })
export type StudentUpdateType = z.infer<typeof StudentCreationSchema>

export class Student implements Serializable {

    firstName: StudentCreationType['firstName']
    surname: StudentCreationType['surname']
    document: StudentCreationType['document']
    bloodType: StudentCreationType['bloodType']
    birthDate: Date
    allergies: StudentCreationType['allergies']
    medications: StudentCreationType['medications']
    startDate: Date
    #parents: StudentCreationType['parent']
    class: StudentCreationType['class']
    readonly id: string;

    constructor(data: StudentCreationType) {

        const parsedData = StudentCreationSchema.parse(data)

        this.firstName = parsedData.firstName
        this.surname = parsedData.surname
        this.document = parsedData.document
        this.bloodType = parsedData.bloodType
        this.birthDate = new Date(parsedData.birthDate)
        this.allergies = parsedData.allergies
        this.medications = parsedData.medications
        this.startDate = new Date(parsedData.startDate)
        this.#parents = parsedData.parent
        this.class = parsedData.class
        this.id = parsedData.id ?? randomUUID()
    }

    get parents() {
        return this.#parents
    }

    set parents(value) {
        this.#parents = value
    }

    static fromObject(data: Record<string, unknown>) {
        const parsed = StudentCreationSchema.parse(data)
        return new Student(parsed)
    }

    toJson(): string {
        return JSON.stringify(this.toObject)
    }
    toObject(): Record<string, unknown> {
        return {
            id: this.id,
            firstName: this.firstName,
            surname: this.surname,
            document: this.document,
            bloodType: this.bloodType,
            birthDate: this.birthDate.toISOString(),
            allergies: this.allergies,
            medications: this.medications,
            startDate: this.startDate.toISOString(),
            parents: this.#parents,
            class: this.class,
        }
    }

}