import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { deleteCourseOutcomeActionApi, editCourseOutcomeActionApi, postNewCourseOutcomeActionApi } from "../../../../../../../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";

function FormOutcomes(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit } = props;

  const confirmDelete = (value) => {
    dispatch(deleteCourseOutcomeActionApi(values));
  };

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
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
            />
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
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="group">CDIO:</label>
            <input
              name="cdio"
              value={values.cdio || ""}
              onChange={handleChange}
              id="cdio"
              className="form-control"
              type="text"
            />
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editOutcomesInCourseOutline.isEdit ? (
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

const FormOutcomesFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editOutcomesInCourseOutline } = props;
    return {
      programId: editOutcomesInCourseOutline?.programId,
      courseId: editOutcomesInCourseOutline?.courseId,
      id: editOutcomesInCourseOutline?.id,
      parentId: editOutcomesInCourseOutline?.parentId, // new
      name: editOutcomesInCourseOutline?.name, // new
      cdio: editOutcomesInCourseOutline?.cdio,
      description: editOutcomesInCourseOutline?.description,
    };
  },
  validationSchema: Yup.object().shape({
    
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const { editOutcomesInCourseOutline } = props;
    if(editOutcomesInCourseOutline.isEdit) {
      props.dispatch(editCourseOutcomeActionApi(values));
    } else {
      props.dispatch(postNewCourseOutcomeActionApi(values));
    }
  },
})(FormOutcomes);

const mapStateToProps = (state) => ({
  editOutcomesInCourseOutline:
    state.GeneralProgramReducer.editOutcomesInCourseOutline,
});

export default connect(mapStateToProps)(FormOutcomesFormik);
