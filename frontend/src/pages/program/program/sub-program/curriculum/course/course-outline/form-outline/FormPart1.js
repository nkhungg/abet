import { Editor } from "@tinymce/tinymce-react";
import { withFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";

function FormPart1(props) {
  const dispatch = useDispatch();

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
  } = props;

  const handleEditorChange = (content, editor) => {
    console.log("content", {content, editor})
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">
              Program Id:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <Editor
              name="description123"
              initialValue={values.description}
              value={values.description}
              init={{
                selector: "textarea#myTextArea",
                height: 500,

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
              onEditorChange={handleEditorChange}
            />
            <span className="text-danger">{errors.programId}</span>
          </div>
        </div>
      </form>
    </div>
  );
}

const FormPart1Formik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
        description: "",
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log("values", values);
  },
})(FormPart1);

const mapStateToProps = (state) => ({
  // editCirSemester: state.GeneralProgramReducer.editCirSemester
});

export default connect(mapStateToProps)(FormPart1Formik);
