import React, { useEffect } from 'react'
import { withFormik } from "formik";
import { Popconfirm } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { addNewCourse, editCourse, deleteCourseActionApi, getDetailCourseActionApi } from '../../actions/api-actions/CourseAction';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { getAttributeActionApi } from '../../actions/api-actions/AttributeAction';

const textConfirm = 'Are you sure to delete this task?'


function FormCourse(props) {
    const dispatch = useDispatch()
    const { atrrList } = useSelector((state) => state.AttributeReducer);
    const { values, errors, handleChange, handleSubmit } = props;
    // useEffect(() => {
    //   dispatch(getAttributeActionApi(1, 'course'));
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    const { courseEdit } = useSelector((state) => state.CourseReducer)
    console.log('courseEdit', courseEdit);

    useEffect(() => {
      if (!courseEdit?.id) return;
      dispatch(getDetailCourseActionApi(courseEdit?.id))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseEdit?.id])
    
    const confirmDelete = (id) => {
      dispatch(deleteCourseActionApi(id))
    }

    const showSideAttr = (detailCourse = {}) => {
     
      return atrrList?.data?.map((attr, idx) => {
        // let result = (values?.sideAttr || []).find(valueAttr => valueAttr.attrId === attr.id)
        // if(attr.type === 'select') {
        //   let { attrOptionList } = attr
        //   let optionHtml = attrOptionList?.map((opt, idx) => {
        //     return <option selected={opt.id === result?.valueId} key={idx} value={opt.id}>
        //       {opt.name}
        //     </option>
        //   })
        //   return <div className="form-group" key={idx}>
        //     <label htmlFor="desc">{attr.name}</label>
        //     <select name={`sideAttr.${idx}`}  className="form-control" onChange={handleChange}>
        //     <option value='' hidden>Please select</option>
        //     {optionHtml}  
        //   </select>
        //   </div>
        // }
        if(attr.type === 'text') {
          return <div className="form-group" key={idx}>
              <label htmlFor="group">{attr.name}</label>
              <input
                name={`sideAttr.${idx}`}
                value={(values.sideAttr || [])[idx] || ''}
                onChange={handleChange}
                className="form-control"
                type="text"
              />
          </div>
        }
        return null
      })
    }

    return (
        <form className='form-create-course' onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">ID: <span className='text-danger font-weight-bold'>*</span></label>
            <input
              name="id"
              value={values.id || ''}
              onChange={handleChange}
              id="id"
              className="form-control"
              type="text"
            />
          <span className="text-danger">{errors.id}</span>

          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">Name: <span className='text-danger font-weight-bold'>*</span> </label>
            <input
              name="name"
              value={values.name || ''}
              onChange={handleChange}
              id="name"
              className="form-control"
              type="text"
            />
            <span className="text-danger">{errors.name}</span>

          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="group">Group: <span className='text-danger font-weight-bold'>*</span> </label>
            <input
              name="groups"
              value={values.groups || ''}
              onChange={handleChange}
              id="groups"
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.groups}</span>

          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="desc">Description: <span className='text-danger font-weight-bold'>*</span> </label>
            <textarea
              name="description"
              value={values.description || ''}
              onChange={handleChange}
              id="desc"
              rows="2"
              className="text-area form-control"
              type="text"
            />
            <span className="text-danger">{errors.description}</span>

          </div>
        </div>
        {/* <div className='col-12'>
            { showSideAttr(props.detailCourse) }
        </div> */}
        <div className="col-12 mt-5 d-flex justify-content-center">
          {  
            props.courseEdit.id ?
            <Popconfirm placement="topLeft" title={textConfirm} onConfirm={() => confirmDelete(values.id)} okText="Yes" cancelText="No">
            <button type="button" className="btn btn-danger mr-5">
              Delete
            </button>
            </Popconfirm> : ''
          }
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    )
}


const EditCourseForm = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { courseEdit, detailCourse } = props;
        // let initialsValues = detailCourse?.attrList?.map((attr) => {
        //   return attr.type === 'text' ? attr.value : attr.valueId
        // })
        // console.log('hehe', initialsValues)
        return {
            id: courseEdit?.id,
            name: courseEdit?.name,
            groups: courseEdit?.groups,
            description: courseEdit?.description,
            // sideAttr: initialsValues,
        }
    },
    validationSchema: Yup.object().shape({
        id: Yup.string().required('Course code is required!'),
        name: Yup.string().required('Course name is required!'),
        // groups: Yup.string().required('Course groups is required!'),
        // description: Yup.string().required('Course description is required!'),
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
        let attrIdArr = []
        // attrIdArr = props.atrrList?.data.map((attr) => {
        //   return attrIdArr.push(attr.id)
        // })
        // values = {...values, attrIdList: attrIdArr}
        if (props.courseEdit?.id) {
          props.dispatch(editCourse(values))
          return;
        } else {
          props.dispatch(addNewCourse(values))
        }
    },
    // displayName: 'EditCourseForm',
})(FormCourse);

const mapStateToProps = (state) => ({
  courseEdit: state.CourseReducer.courseEdit,
  atrrList: state.AttributeReducer.atrrList,
  detailCourse: state.CourseReducer.detailCourse
})


export default connect(mapStateToProps)(EditCourseForm);