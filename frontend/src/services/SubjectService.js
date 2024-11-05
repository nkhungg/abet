import {baseService} from './BaseService'
import axios from 'axios'
import { ACCESSTOKEN, DOMAIN } from '../util/SettingSystem'

export class SubjectService extends baseService {

    getLecturerList = () => {
        return axios({
            url:`${DOMAIN}/students?name=&id=&major=&year=&email=`,
            method:'GET',
            headers:{
                'Authorization':`Bearer ${localStorage.getItem(ACCESSTOKEN)}`
            }
        });
    }
    
}

export const subjectService = new SubjectService();
