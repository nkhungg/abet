import { baseService } from './BaseService'

export class AttributeService extends baseService {
    getAttribute = (page, tableName = '') => {
        return this.get(`/attributes?tableName=${tableName}&currentPage=${page}&pageSize=10`)
    }
}

export const attributeService = new AttributeService();
