import { makeAutoObservable } from "mobx"
import { inject, injectable } from 'inversify'
import { Course } from 'linkWithBackend/interfaces/TendonType'
import TYPES from "linkWithBackend/interfaces/TendonType";
import APIService from './api_service';
import { CourseServiceInterface } from 'linkWithBackend/interfaces/ServiceInterface';

@injectable()
class CourseService implements CourseServiceInterface {
    response: Course
    status: number
    message: string
    apiService: APIService

    constructor(
        @inject(TYPES.APIService) apiService: APIService
    ) {
        makeAutoObservable(this)
        this.apiService = apiService
        this.response = {} as Course
        this.status = 0
        this.message = ""
    }

    async postCourse(body: Course) {
        let bodySend:Course = {
            id: "",
            name: body.name,
            description: body.description,
            access: body.access,
            lessons: body.lessons
        }

        const result = await this.apiService.post<Course>(
            "http://24.199.72.217:8080/api/v1/auth/courses",
            bodySend,
        )
        this.message = result.message
        this.status = result.status
        return this.response = result.response
    }

    async getCourseById(id: string){
        let result = await this.apiService.get<Course>(`http://24.199.72.217:8080/api/v1/auth/courses/${id}`)
        this.message = result.message
        this.status = result.status
        return this.response = result.response
    }

    async updateCourse(id: string, body: Course) {
        let bodySend:Course = {
            id: "",
            name: body.name,
            description: body.description,
            access: body.access,
            createBy: body.createBy,
            lessons: body.lessons
        }

        const result = await this.apiService.update<Course>(
            "http://24.199.72.217:8080/api/v1/auth/courses",
            bodySend,
            id,
        )
        this.message = result.message
        this.status = result.status
        return this.response = result.response
    }

    async deleteCourse(id: string) {
        return this.status = await this.apiService.delete<Course>("http://24.199.72.217:8080/api/v1/auth/courses", id)
    }

    public getStatus() {
        return this.status
    }

    public getResponse() {
        return this.response
    }

    public getMessage() {
        return this.message
    }

}

export default CourseService
