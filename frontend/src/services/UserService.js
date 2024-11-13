import {baseService} from './BaseService'

export class UserService extends baseService {

    signIn = (data) => {
        return this.post('/login', 1, data)
    }

    signUp = (data) => {
        return this.post('/signup', 1, data)
    }

    getInfoFromAccessToken = () => {
        return this.get('/profile')
    }
}

export const userService = new UserService();
