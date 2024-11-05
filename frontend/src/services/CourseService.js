import { baseService } from './BaseService'
export class CourseService extends baseService {

    getCourseList = (page, searchObj) => {
        console.log('11', { page, searchObj });
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/general-courses?currentPage=${page}${searchContent}`)
    }
    getDeatilCourse = (id) => {
        return this.get(`/general-courses/${id}`)
    }

    deleteCourse = (id) => {
        return this.delete(`/general-courses/${id}`)
    }

    getAttribute = () => {
        return this.get('/course-attr')
    }

    postNewCourse = (formData) => {
        let header = this.getAuthorizationHeader()
        header = {...header,'Content-Type': 'multipart/form-data'}
        return this.post('/general-courses' ,header, formData)
    }

    putCourse = (formData, id) => {
        let header = this.getAuthorizationHeader()
        header = {...header,'Content-Type': 'multipart/form-data'}
        return this.put(`/general-courses/${id}` ,header, formData)
    }
    
}

export const courseService = new CourseService();
