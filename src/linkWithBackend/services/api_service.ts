import axios from "axios";
import { inject, injectable } from "inversify";
import TYPES from "linkWithBackend/interfaces/TendonType";
import { makeAutoObservable, values } from "mobx";
import { APIServiceInterface, GetManyResponse, GetResponse } from "../interfaces/ServiceInterface";
import MemoryService from "./memory_service";

@injectable()
class APIService implements APIServiceInterface {
    status: number
    message: string
    memService: MemoryService

    constructor(
        @inject(TYPES.MemoryService) memService: MemoryService,
    ) {
        makeAutoObservable(this)
        this.status = 0
        this.message = ""
        this.memService = memService
    }

    public async post<Type>(url: string, body: Type) {
        let response: Type = {} as Type
        let token = this.memService.getLocalStorage("token")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        await axios.post(url, body, config)

        .then((response) => {
            this.status = response.status
            response = response.data
        })
        .catch((err) => {
            this.status = Object(err)["response"]["request"]["status"]
            this.message = Object(err)["response"]["data"]["message"]
            console.log(err)
            response = {} as Type
        })

        return { 
            response: response, 
            status: this.status, 
            message: this.message 
        }
    }

    public async get<Type>(url: string) {
        let result: GetResponse<Type> = {} as GetResponse<Type>
        let token = this.memService.getLocalStorage("token")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        let tmp_response: any
        try { 
            tmp_response =  await axios.get<any>(url, config)
            this.status = tmp_response.status
            result = {
                status: this.status,
                response: tmp_response.data,
                message: tmp_response.data.message
            }
        } catch (err) {
            this.status = Object(err)["response"]["request"]["status"]
            result = {} as GetResponse<Type>
        }
        return result
    }??

    public async getManyByID<Type>(url: string) {
        let result: GetManyResponse<Type> = {} as GetManyResponse<Type>
        let token = this.memService.getLocalStorage("token")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        let tmp_response: any
        try { 
            tmp_response =  await axios.get<any>(url, config)
            this.status = tmp_response.status
            result = {
                status: this.status,
                response: tmp_response.data,
                message: tmp_response.data.message
            }
        } catch (err) {
            this.status = Object(err)["response"]["request"]["status"]
            this.message = Object(err)["response"]["data"]["message"]
            result = {} as GetManyResponse<Type>
        }
        return result
    }

    public async update<Type>(url: string, body: Type, id: string) {
        let response: Type = {} as Type
        let token = this.memService.getLocalStorage("token")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try { 
            await axios.patch(url+"/"+id, body, config)
            .then((res) => {
                this.status = res.status
                response = res.data
            })
        } catch (err) {
            this.status = Object(err)["response"]["request"]["status"]
            this.message = Object(err)["response"]["data"]["message"]
            response = {} as Type
        }

        return { 
            response: response, 
            status: this.status, 
            message: this.message 
        }
    }

    public async delete<Type>(url: string, id: string) {
        let token = this.memService.getLocalStorage("token")
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            await axios.delete(url+"/"+id, config)
            .then((res) => {
                this.status = res.status
            })
        } catch(err) {
            this.status = Object(err)["response"]["request"]["status"]
        }
        return this.status
    }
}

export default APIService