import { z } from "zod";
import { Serializable } from "./types.js";
import { randomUUID } from "crypto";

export const ClassCreationSchema = z.object({
    id: z.string().uuid().optional(),
    teacher: z.string().uuid().nullable(),
    code: z.string().regex(/^[0-9]{1}[A-H]{1}-[MTN]$/)
})

export type ClassCreationType = z.infer<typeof ClassCreationSchema>
export const ClassUpdateSchema = ClassCreationSchema.partial().omit({ id: true })
export type ClassUpdateType = z.infer<typeof ClassUpdateSchema>

export class Class implements Serializable {

    code: ClassCreationType['code']
    accessor teacher: ClassCreationType['teacher']
    readonly id: string

    constructor(data: ClassCreationType) {
        this.code = data.code
        this.teacher = data.teacher
        this.id = data.id ?? randomUUID()
    }

    static fromObject(data: Record<string, unknown>) {
        const parsed = ClassCreationSchema.parse(data)
        return new Class(parsed)
    }
    toJson(){
        return JSON.stringify(this.toObject())
    }
    toObject() {
        return {
            code: this.code,
            teacher: this.teacher,
            id: this.id,
        }
    }
}