import React, { useState, useEffect } from "react";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Popconfirm, Button } from "antd";
import { connect } from "react-redux";
import { addNewIndicatorsActionApi, deleteIndicatorActionApi, editIndicatorsActionApi } from "../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";

function FormIndicator(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit, setFieldValue } = props;
  const [answerNum, setAnswerNum] = useState([]);

  useEffect(() => {
    let indicatorLevelSetCount = ((props.editIndicator || {}).indicatorLevelSet || []).length
    if (indicatorLevelSetCount) {
      let newArray = [...answerNum]
      for (let i = 0; i < indicatorLevelSetCount; i++) {
        newArray.push(1)
      }
      setAnswerNum(newArray)
    }
  }, [])

  const confirmDelete = (programId, outcomeName, indicatorName) => {
    dispatch(deleteIndicatorActionApi(programId, outcomeName, indicatorName))
  };
  const handleChangeCheckbox = (e) => {
    setFieldValue('comment', e.target.checked)
  }
  const createLevelSet = () => {
    setAnswerNum(oldArray => [...oldArray, 1])
    setFieldValue(`levelSet[${answerNum.length}]`, '')
    setFieldValue(`descriptionSet[${answerNum.length}]`, '')
  }

  const removeOption = (idx) => {
    let newArray = answerNum.filter((ele, index) => idx !== index)
    setAnswerNum(newArray)
    let newLevels = values.levelSet.filter((ele, index) => idx !== index)
    setFieldValue('levelSet', newLevels)
    let newDescriptions = values.descriptionSet.filter((ele, index) => idx !== index)
    setFieldValue('descriptionSet', newDescriptions)
  }

  const handleChangeMultiLevel = (e, idx) => {
    setFieldValue(`levelSet[${idx}]`, e.target.value)
  }

  const handleChangeMultidescription = (e, idx) => {
    setFieldValue(`descriptionSet[${idx}]`, e.target.value)
  }

  const renderInputAnswerOptions = () => {
    return answerNum?.map((ele, idx) => {
      return <div key={idx} className="col-12 form-group mx-0 p-0 d-flex" >
        <div className=" col-3">
          <label htmlFor="desc">Level:</label>
          <Field
            name={`levelSet.${idx}`}
            value={`${values.levelSet[idx]}` || ''}
            onChange={(e) => handleChangeMultiLevel(e, idx)}
            id="additionalQuestion"
            rows="2"
            className="text-area form-control"
            type="number"
          />
        </div>
        <div className="form-group col-9">
          <label htmlFor="desc" className="mr-3">Description:</label>
          <span title="remove option" onClick={() => removeOption(idx)} style={{ color: '#595959', cursor: 'pointer' }}><i className="fa fa-trash-alt"></i></span>
          <Field
            name={`descriptionSet.${idx}`}
            value={`${values.descriptionSet[idx]}` || ''}
            onChange={(e) => handleChangeMultidescription(e, idx)}
            id="descriptionSet"
            rows="2"
            className="text-area form-control"
            type="text"
          />
        </div>
      </div>
    })
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">
              OutcomeName: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="outcomeName"
              value={values.outcomeName || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.selectedFolw.outcomeName}
            />
            <span className="text-danger">{errors.outcomeName}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">
              Name: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.editIndicator.name}
            />
            <span className="text-danger">{errors.name}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="cdio">
              Cdio: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="cdio"
              value={values.cdio || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
            <span className="text-danger">{errors.cdio}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="level">Level:</label>
            <input
              name="level"
              value={values.level || ""}
              onChange={handleChange}
              id="level"
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.level}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="desc">Description:</label>
            <textarea
              name="description"
              value={values.description || ""}
              onChange={handleChange}
              id="desc"
              rows="2"
              className="text-area form-control"
              type="text"
            />
            <span className="text-danger">{errors.description}</span>
          </div>
        </div>
        {/* add multi options for Additional Question */}
        <div className="col-12">
          <div className="form-group">
            <Button
              onClick={() => createLevelSet()}
            >
              Create level and description
            </Button>
          </div>
        </div>
        {/* render more level + description */}
        {renderInputAnswerOptions()}
        {/* end render more level + description */}

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="desc">Additional question:</label>
            <textarea
              name="additionalQuestion"
              value={values.additionalQuestion || ""}
              onChange={handleChange}
              id="additionalQuestion"
              rows="2"
              className="text-area form-control"
              type="text"
            />
            <span className="text-danger">{errors.additionalQuestion}</span>
          </div>
        </div>
        <div className='col-12'>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              name="comment"
              checked={values.comment}
              value={values.comment || 0}
              onChange={(e) => handleChangeCheckbox(e)}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">Comment</label>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editIndicator.name ? (
            <Popconfirm
              placement="topLeft"
              title={textConfirm}
              onConfirm={() => confirmDelete(values.programId, values.outcomeName, values.name)}
              okText="Yes"
              cancelText="No"
            >
              <button type="button" className="btn btn-danger mr-5">
                Delete
              </button>
            </Popconfirm>
          ) : (
            ""
          )}
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const FormIndicatorFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editIndicator, selectedFolw } = props;
    let levelSet = ((editIndicator || {}).indicatorLevelSet || []).map((ele) => +ele.levelId)
    let descriptionSet = ((editIndicator || {}).indicatorLevelSet || []).map((ele) => ele.description)
    return {
      programId: selectedFolw?.programId,
      outcomeName: selectedFolw?.outcomeName,
      name: editIndicator?.name,
      cdio: editIndicator?.cdio,
      level: editIndicator?.level,
      description: editIndicator?.description,
      additionalQuestion: editIndicator?.additionalQuestion,
      comment: editIndicator?.comment,
      levelSet: levelSet,
      descriptionSet: descriptionSet,
    };
  },
  validationSchema: Yup.object().shape({
    // id: Yup.string().required("Course code is required!"),
    //   description: Yup.string().required("Course description is required!"),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    if (props.editIndicator.name) {
      props.dispatch(editIndicatorsActionApi(values))
    } else {
      props.dispatch(addNewIndicatorsActionApi(values))
    }
  },
})(FormIndicator);

const mapStateToProps = (state) => ({
  editIndicator: state.GeneralProgramReducer.editIndicator,
  selectedFolw: state.GeneralProgramReducer.selectedFolw,
});

export default connect(mapStateToProps)(FormIndicatorFormik);
