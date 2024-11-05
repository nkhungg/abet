import React, { useState } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import "./CourseOutline.scss";
import { editCourseOutlineEditorActionApi } from "../../../../../../../actions/api-actions/ProgramAction";
import { useDispatch,useSelector } from "react-redux";

function OutlineContact(props) {
  const { values, errors, handleChange, handleSubmit, setValues } = props;
  const dispatch = useDispatch();

  const [isEdit, setEdit] = useState(false);

  const showEditForm = () => {
    setEdit(true);
    document.getElementById("fieldset").removeAttribute("disabled");
  };
  const { selectedFolw, courseOutlineInfo } = useSelector((state) => state.GeneralProgramReducer);

  const hideEditForm = (e, isCancel = false) => {
    if(isCancel) {
      setValues(courseOutlineInfo?.data)
    } else {
      dispatch(editCourseOutlineEditorActionApi(selectedFolw.programId, selectedFolw.cirCourseId, values))
    }
    setEdit(false);
    document.getElementById("fieldset").setAttribute("disabled", "disabled");
  };

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <fieldset id="fieldset" disabled="disabled">
          <div className="col-12">
            <div className="form-group d-flex justify-content-center align-items-center">
              <label
                className="contact-label mb-0"
                htmlFor="facultyInCharge"
              >
                Khoa phụ trách:{" "}
                <span className="text-danger font-weight-bold">*</span>
              </label>
              <input
                name="facultyInCharge"
                value={values.facultyInCharge || ""}
                onChange={handleChange}
                className="form-control contact-input"
                type="text"
              />
              <span className="text-danger">{errors.facultyInCharge}</span>
            </div>
          </div>
          <div className="col-12">
            <div className="form-group d-flex justify-content-center align-items-center">
              <label className="contact-label mb-0" htmlFor="office">
                Văn phòng:{" "}
                <span className="text-danger font-weight-bold">*</span>
              </label>
              <input
                name="office"
                value={values.office || ""}
                onChange={handleChange}
                className="form-control contact-input"
                type="text"
              />
              <span className="text-danger">{errors.office}</span>
            </div>
          </div>
          <div className="col-12">
            <div className="form-group d-flex justify-content-center align-items-center">
              <label className="contact-label mb-0" htmlFor="telephone">
                Điện thoại:
              </label>
              <input
                name="telephone"
                value={values.telephone || ""}
                onChange={handleChange}
                id="telephone"
                className="form-control contact-input"
                type="text"
              />
              <span className="text-danger">{errors.telephone}</span>
            </div>
          </div>
          <div className="col-12">
            <div className="form-group d-flex justify-content-center align-items-center">
              <label className="contact-label mb-0" htmlFor="lecturerInCharge">
                Giảng viên phụ trách:
              </label>
              <input
                name="lecturerInCharge"
                value={values.lecturerInCharge || ""}
                onChange={handleChange}
                id="lecturerInCharge"
                className="form-control contact-input"
                type="text"
              />
              <span className="text-danger">{errors.lecturerInCharge}</span>
            </div>
          </div>
          <div className="col-12">
            <div className="form-group d-flex justify-content-center align-items-center">
              <label className="contact-label mb-0" htmlFor="email">
                Email:
              </label>
              <input
                name="email"
                value={values.email || ""}
                onChange={handleChange}
                id="email"
                className="form-control contact-input"
                type="email"
              />
              <span className="text-danger">{errors.email}</span>
            </div>
          </div>
        </fieldset>
        <div className="mt-2 d-flex justify-content-start">
          {isEdit ? (
            <div className="mt-2 d-flex justify-content-start">
            <button
              onClick={(e) => hideEditForm(e, false)}
              type="button"
              className="px-3 mb-2 btn mr-3 text-white btn-edit-general"
            >
              Update
            </button>
            <button
              onClick={(e) => hideEditForm(e, true)}
              type="submit"
              className="px-3 mb-2 btn mr-3 text-white btn-edit-general"
            >
              Cancel
            </button>
            </div>
          ) : (
            <button
              onClick={() => showEditForm()}
              type="submit"
              className="px-3 mb-2 btn mr-2 text-white btn-edit-general"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const OutlineContactFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    let { courseOutlineInfo } = props;
    let {
      facultyInCharge,
      office,
      telephone,
      lecturerInCharge,
      email,
    } = courseOutlineInfo?.data;
    return {
      facultyInCharge,
      office,
      telephone,
      lecturerInCharge,
      email,
    };
  },
  validationSchema: Yup.object().shape({
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { selectedFolw } = props;
    console.log("update")
    props.dispatch(editCourseOutlineEditorActionApi(selectedFolw.programId, selectedFolw.cirCourseId, values))
  },
})(OutlineContact);

const mapStateToProps = (state) => ({
  courseOutlineInfo: state.GeneralProgramReducer.courseOutlineInfo,
  selectedFolw: state.GeneralProgramReducer.selectedFolw,
});

export default connect(mapStateToProps)(OutlineContactFormik);
