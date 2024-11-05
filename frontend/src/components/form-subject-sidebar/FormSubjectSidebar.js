import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { deleteSubjectsSideBarActionApi, editSubjectsSideBarActionApi, postSubjectsSideBarActionApi } from "../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";

function FormSubjectSidebar(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit } = props;

  const confirmDelete = (subjectId) => {
    dispatch(deleteSubjectsSideBarActionApi(subjectId));
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
            <span className="text-danger">{errors.name}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editSubjectSidebar.isEdit ? (
            <Popconfirm
              placement="topLeft"
              title={textConfirm}
              onConfirm={() => confirmDelete(values.id)}
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

const FormSubjectSidebarFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editSubjectSidebar } = props;
    return {
      id: editSubjectSidebar?.id,
      name: editSubjectSidebar?.name,
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Name code is required!"),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    if (props.editSubjectSidebar.isEdit) {
      props.dispatch(editSubjectsSideBarActionApi(values));
    } else {
      props.dispatch(postSubjectsSideBarActionApi(values));
    }
  },
})(FormSubjectSidebar);

const mapStateToProps = (state) => ({
    editSubjectSidebar: state.GeneralProgramReducer.editSubjectSidebar,
});

export default connect(mapStateToProps)(FormSubjectSidebarFormik);
