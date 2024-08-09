import { StudentRepository } from "../data/StudentRepository.js";
import { ConflictError } from "../domain/errors/Conflict.js";
import { EmptyDependecyError } from "../domain/errors/EmptyDependecy.js";
import { Parent } from "../domain/Parent.js";
import { Student, StudentCreationType, StudentUpdateType } from "../domain/Student.js";
import { Serializable } from "../domain/types.js";
import { Service } from "./BaseService.js";
import { ParentService } from "./ParentService.js";

export class StudentService extends Service {

    constructor(repository: StudentRepository, private readonly ParentService: ParentService) {
        super(repository)
    }
    update(id: string, newData: StudentUpdateType) {
        const existing = this.findById(id) as Student
        const updated = new Student({
            ...existing.toObject(),
            ...newData
        })

        this.repository.save(updated)
        return updated;
    }

    create(creationData: StudentCreationType): Serializable {
        const existing = this.repository.listBy('document', creationData.document)
        if (existing.length > 0) throw new ConflictError(creationData.document, Student)

        creationData.parent.forEach((parent) => {
            this.ParentService.findById(parent)
        })

        const entity = new Student(creationData)
        this.repository.save(entity)
        return entity;
    }

    getParents(studentId: string): Parent[] {
        const student = this.findById(studentId) as Student
        return student.parents.map((parent) => this.ParentService.findById(parent)) as Parent[]
    }

    linkParents(id: string, parentsToUpdate: StudentCreationType['parent']) {
        const student = this.findById(id) as Student
        parentsToUpdate.forEach((parentId) => this.ParentService.findById(parentId))

        student.parents = parentsToUpdate
        this.repository.save(student)
        return student
      }
}