import { GET_ALL_ATTRIBUTE } from "../../redux/types"
import { attributeService } from "../../services/AttributeService"

export const getAttributeActionApi = (page, tableName) => {
  return async (dispatch) => {
    try {
      console.log({page, tableName});
      let result = await attributeService.getAttribute(page, tableName)
      if(result && result.data) {
        dispatch({
          type: GET_ALL_ATTRIBUTE,
          payload: result.data
        })
      }
    } catch(err) {
      console.log('err', err)
    }
  }
}