import {baseService} from './BaseService'
import axios from 'axios'
import { ACCESSTOKEN, DOMAIN } from '../util/SettingSystem'

export class StudentService extends baseService {

    getStudentList = () => {
        return this.get(`/students`)
    }
    
}

export const studentService = new StudentService();
