import axios from "axios"
import { ACCESSTOKEN, DOMAIN } from '../util/SettingSystem'

export class baseService {
    // GET HEADER
    getAuthorizationHeader = () => { 
        return {
            'Authorization':`Bearer ${localStorage.getItem(ACCESSTOKEN)}`
        }
    }
    
    // PHƯƠNG THỨC GET
    get = (url) => {
        let promise = axios({
            url:`${DOMAIN}${url}`,
            method:'GET',
            headers: this.getAuthorizationHeader()
        });
        return promise;
    }
    
    // PHƯƠNG THỨC POST
    post = (url, type, data) => {
        // post AccessToken (default)
        let headers = this.getAuthorizationHeader()
        // post login no AccessToken
        if(type === 1) { 
            headers = null
        } 
        // post AccessToken & formData
        if(type === 3) {
            headers = {...headers,'Content-Type': 'multipart/form-data'}
        }
        let request = 
            {
                url:`${DOMAIN}${url}`,
                method:'POST',
                data,
                headers
            }
        return axios(request) 
    }

    put = (url, type, data) => {
        let headers = this.getAuthorizationHeader()
        if(type === 1) { 
            headers = null
        } 
        if(type === 3) {
            headers = {...headers,'Content-Type': 'multipart/form-data'}
        }
        let promise = axios({
            url:`${DOMAIN}${url}`,
            method:'PUT',
            data:data,
            headers
        });
        return promise;
    }

    // PHƯƠNG THỨC DELETE
    delete = (url) => {
        let promise = axios({
            url:`${DOMAIN}${url}`,
            method:'DELETE',
            headers: this.getAuthorizationHeader()
        });
        return promise;
    }

    delete = (url, data) => {
        let promise = axios({
            url:`${DOMAIN}${url}`,
            method:'DELETE',
            data:data,
            headers: this.getAuthorizationHeader()
        });
        return promise;
    }
}