import React, { useEffect } from "react";
import { withFormik, FieldArray, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
    deleteVersionSurveyQuestionActionApi,
    editVersionSurveyQuestionActionApi,
    getAllOutcomeListActionApi,
    getIndicatorAutocompleteActionApi,
    postVersionSurveyQuestionActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Button, Popconfirm } from "antd";
import { Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionSurveyQuestion(props) {
    const dispatch = useDispatch();
    const [answerNum, setAnswerNum] = useState([]); 
    const { values, handleChange, handleSubmit, setFieldValue } = props;

    const {
        selectedFlowProgramVersion,
        indicatorNameAutocomplete,
        allOutcomeList
    } = useSelector((state) => state.GeneralProgramReducer);

    const { programVersionInfo, surveyName, programVersionId } = selectedFlowProgramVersion;

    useEffect(() => {
        dispatch(getIndicatorAutocompleteActionApi(programVersionId));
        dispatch(getAllOutcomeListActionApi(programVersionId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [programVersionId]);

    useEffect(() => {
        if (values.optionSet.length) {
            let newArray = [...answerNum]
            for (let i = 0; i < values.optionSet.length; i++) {
                newArray.push(1)
            }
            setAnswerNum(newArray)
        }
    }, [])

    const addAnswerOptions = () => {
        let oldValue = (values.optionSet || [])[answerNum.length - 1] || ''
        if(!oldValue && answerNum.length > 0) {
            alert('Please fill option!')
            return
        }
        setAnswerNum(oldArray => [...oldArray, 1])
        setFieldValue(`optionSet[${answerNum.length}]`, '')
    }

    const handleChangeMultiOptions = (e, idx) => {
        setFieldValue(`optionSet[${idx}]`, e.target.value)
    }

    const removeOption = (idx) => {
        let newArray = answerNum.filter((ele, index) => idx !== index)
        setAnswerNum(newArray)    
        let newFriends = values.optionSet.filter((ele, index) => idx !== index)
        setFieldValue('optionSet', newFriends)
    }

    const renderInputAnswerOptions = () => {
        return answerNum?.map((ele, idx) => {
            return <div className="col-12" key={`${ele}${idx}`}>
                <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                        <label htmlFor="additionalQuestion">
                            Options {+idx + 1}
                        </label>
                        <span title="remove option" onClick={() => removeOption(idx)} style={{ color: '#595959', cursor: 'pointer' }}><i className="fa fa-trash-alt"></i></span>
                    </div>
                    <Field
                        name={`optionSet.${idx}`}
                        onChange={(e) => handleChangeMultiOptions(e, idx)}
                        className="form-control"
                        type="text"
                        value={`${values.optionSet[idx]}`|| ''}
                    />
                </div>
            </div>
        })
    }

    const confirmDelete = (values) => {
        let valueUpdate = { ...values, programVersionInfo, surveyName };
        dispatch(deleteVersionSurveyQuestionActionApi(valueUpdate))
    };

    const renderIndicators = () => {
        return indicatorNameAutocomplete?.data?.map((item, idx) => {
            return (
                <Option value={item} key={idx}>
                    {item}
                </Option>
            );
        });
    };

    const renderOutcomeList = () => {
        return allOutcomeList?.data?.map((item, idx) => {
            return (
                <Option title={item.description} value={item.outcomeName} key={idx}>
                    {item.outcomeName} - {item.description}
                </Option>
            );
        });
    }

    const changeIndicatorName = (e) => {
        setFieldValue("indicatorName", e);
    };

    const changeOutcome = (e) => {
        setFieldValue("outcome", e);
    };

    const handleChangeCheckbox = (e) => {
        setFieldValue('comment', e.target.checked)
    }

    const handleEditorChangeDescription = (content, editor) => {
        setFieldValue("description", content);
    };

    return (
        <div>
            <form className="form-create-course" onSubmit={handleSubmit}>
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="indicatorName">
                            Indicator: <span className="text-danger font-weight-bold">*</span>
                        </label>
                        <Select
                            size="default"
                            placeholder="Please select"
                            value={values.indicatorName || ""}
                            onChange={(e) => changeIndicatorName(e)}
                            style={{ width: "100%" }}
                            className="general-select-ant mb-4"
                            filterOption={(keyword, option) =>
                                option.children
                                    .toString()
                                    .toLowerCase()
                                    .includes(keyword.toLowerCase())
                            }
                        >
                            {renderIndicators()}
                        </Select>
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="additionalQuestion">
                            Additional Question: <span className="text-danger font-weight-bold">*</span>
                        </label>
                        <input
                            name="additionalQuestion"
                            value={values.additionalQuestion || ""}
                            onChange={handleChange}
                            className="form-control"
                            type="text"
                        />
                    </div>
                </div>

                {/* add multi options for Additional Question */}
                <div className="col-12">
                    <div className="form-group">
                        <Button
                            onClick={() => addAnswerOptions()}
                        >
                            Create answer options
                        </Button>
                    </div>
                </div>

                {renderInputAnswerOptions()}

                <div className='col-12 mb-3'>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck1"
                            name="comment"
                            checked={values.comment || ''}
                            value={values.comment || ''}
                            onChange={(e) => handleChangeCheckbox(e)}
                        />
                        <label className="form-check-label" htmlFor="exampleCheck1">Comment</label>
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="description">
                            Description: <span className="text-danger font-weight-bold">*</span>
                        </label>
                        <Editor
                            className="outline-general-input w-100"
                            name="description"
                            id="note-form-editor"
                            value={values?.description || ""}
                            init={{
                                selector: "textarea#myTextArea",
                                height: 150,
                                menubar: false,
                                plugins: [
                                    "advlist autolink lists link image charmap print preview anchor",
                                    "searchreplace visualblocks code fullscreen",
                                    "insertdatetime media table paste code help wordcount",
                                ],
                                toolbar:
                                    "undo redo | formatselect | bold italic underline forecolor backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help",
                            }}
                            onEditorChange={handleEditorChangeDescription}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="priority">
                            Priority: <span className="text-danger font-weight-bold">*</span>
                        </label>
                        <input
                            name="priority"
                            value={values.priority || ""}
                            onChange={handleChange}
                            className="form-control"
                            type="number"
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="maxGrade">
                            Max Grade: <span className="text-danger font-weight-bold">*</span>
                        </label>
                        <input
                            name="maxGrade"
                            value={values.maxGrade || ""}
                            onChange={handleChange}
                            className="form-control"
                            type="number"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="outcome">
                            Outcome: <span className="text-danger font-weight-bold">*</span>
                        </label>
                        <Select
                            size="default"
                            placeholder="Please select"
                            value={values.outcome || ""}
                            onChange={(e) => changeOutcome(e)}
                            style={{ width: "100%" }}
                            className="general-select-ant mb-4"
                            filterOption={(keyword, option) =>
                                option.children
                                    .toString()
                                    .toLowerCase()
                                    .includes(keyword.toLowerCase())
                            }
                        >
                            {renderOutcomeList()}
                        </Select>
                    </div>
                </div>

                <div className="col-12 mt-5 d-flex justify-content-center">
                    {props.editVersionSurveyQuestion.isEdit ? (
                        <Popconfirm
                            placement="topLeft"
                            title={textConfirm}
                            onConfirm={() => confirmDelete(values)}
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

const FormVersionSurveyQuestionFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { editVersionSurveyQuestion } = props;
        let optionSet = []
        if(editVersionSurveyQuestion.isEdit && (editVersionSurveyQuestion.optionSet || []).length) {
            optionSet = editVersionSurveyQuestion.optionSet
        }
        return {
            id: editVersionSurveyQuestion?.id,
            indicatorName: editVersionSurveyQuestion?.indicatorName, // select
            additionalQuestion: editVersionSurveyQuestion?.additionalQuestion,
            comment: editVersionSurveyQuestion?.comment, // checkbox
            description: editVersionSurveyQuestion?.description,
            priority: editVersionSurveyQuestion?.priority, // input number
            maxGrade: editVersionSurveyQuestion?.maxGrade, // input number decimal
            outcome: editVersionSurveyQuestion?.outcome, // select
            optionSet: optionSet,
        };
    },
    validationSchema: Yup.object().shape({}),
    handleSubmit: (values, { props, setSubmitting }) => {
        let { editVersionSurveyQuestion, selectedFlowProgramVersion, dispatch } = props;
        let { programVersionInfo, surveyName } = selectedFlowProgramVersion;
        let valueUpdate = { ...values, programVersionInfo, surveyName, comment: values.comment ? 1 : 0 }
        if (editVersionSurveyQuestion.isEdit) {
            dispatch(editVersionSurveyQuestionActionApi(valueUpdate))
        } else {
            dispatch(postVersionSurveyQuestionActionApi(valueUpdate))
        }
    },
})(FormVersionSurveyQuestion);

const mapStateToProps = (state) => ({
    editVersionSurveyQuestion: state.GeneralProgramReducer.editVersionSurveyQuestion,
    selectedFlowProgramVersion:
        state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionSurveyQuestionFormik);
