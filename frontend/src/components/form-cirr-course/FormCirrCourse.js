import React, { useState, useEffect } from "react";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";
import { AutoComplete } from "antd";
import "./FormCirrCourse.css";
import {
  addpostNewCirrCourseActionApi,
  deleteCirrCourseActionApi,
  editCirrCourseActionApi,
  getCourseAutocompleteActionApi,
} from "../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";

function FormCirrCourse(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit, setFieldValue } = props;
  const { courseAutocomplete, cirSemester, cirGroup } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const dataCourseDefault = courseAutocomplete.data;
  const dataSemesterDefault = cirSemester.data;
  const dataGroupDefault = cirGroup.data;

  const [courseOptions, setCourseOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);

  const [valueSemester, setValueSemester] = useState("");
  const [valuaGroup, setValuaGroup] = useState("");

  useEffect(() => {
    dispatch(getCourseAutocompleteActionApi());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (values) => {
    dispatch(deleteCirrCourseActionApi(values))
  };

  return (
    <div>
      <form className="form-cirr-course" onSubmit={handleSubmit}>
      
        {/* binding semester or group disabled */}
        <div className="col-12">
          <div className="form-group">
            <label>{props.type ? "Semester:" : "Group:"}</label>
            <input
              name={props.type ? "semesterName" : "groupName"}
              value={props.type ? (values.semesterName || '') : (values.groupName || '')}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled
            />
          </div>
        </div>
        {/* selected semester or group by keyword search */}
        {/* semester autocomplete  */}
        {!props.type && (
          <div className="col-12">
            <div className="form-group">
              <label>Semester:</label>
              <br />
              <AutoComplete
                options={semesterOptions?.map((course) => {
                  return { label: course.name, value: `${course.id}` };
                })}
                // binding value UI
                value={values.semesterName || ""}
                // user bind value every typing text
                onChange={(text) => {
                  setValueSemester(text);
                }}
                // onSelect get value duoc selected
                onSelect={(valueSelect, option) => {
                  //set giá trị của hộp thọa = option.label
                  // get option and assign cho values.id of formik
                  setFieldValue("semesterId", valueSelect);
                  setFieldValue("semesterName", option.label);
                }}
                style={{ width: "100%" }}
                onSearch={(searchText) => {
                  setSemesterOptions(
                    [
                      ...dataSemesterDefault?.filter((course) =>
                        course.name.includes(searchText)
                      ),
                    ].splice(0, 5)
                  );
                  setFieldValue("semesterName", searchText);
                }}
                onBlur={(e) => {
                let isValid = dataSemesterDefault?.some(course => course.name.includes(e.target.value))
                if(!isValid) {
                  setFieldValue("semesterName", '');
                  setFieldValue("semesterId", null);
                }
              }}
              />
              <span className="text-danger">{errors.semesterName}</span>
            </div>
          </div>
        )}
        {/* groups autocomplete */}
        {props.type && (
          <div className="col-12">
            <div className="form-group">
              <label>Group:</label>
              <br />
              <AutoComplete
                options={groupOptions?.map((group) => {
                  return { label: group.name, value: `${group.id}` };
                })}
                // binding value UI
                value={values.groupName || ''}
                // user bind value every typing text
                onChange={(text) => {
                  setValuaGroup(text);
                }}
                // onSelect get value duoc selected
                onSelect={(valueSelect, option) => {
                  console.log("values", { valueSelect, option });
                  // get option and assign cho values.id of formik
                  setFieldValue("groupId", valueSelect);
                  setFieldValue("groupName", option.label);
                }}
                style={{ width: "100%" }}
                onSearch={(searchText) => {
                  setGroupOptions(
                    [
                      ...dataGroupDefault?.filter((course) =>
                        course.name.includes(searchText)
                      ),
                    ].splice(0, 5)
                  );
                  setFieldValue("groupName", searchText);
                }}
                onBlur={(e) => {
                let isValid = dataGroupDefault?.some(course => course.name.includes(e.target.value))
                if(!isValid) {
                  setFieldValue("groupName", '');
                  setFieldValue("groupId", null);
                }
              }}
              />
              <span className="text-danger">{errors.groupName}</span>
            </div>
          </div>
        )}
        {/* Autocomplete courseId list */}
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">
              Course Id: <span className="text-danger font-weight-bold">*</span>
            </label>
            <br />
            <AutoComplete
              options={courseOptions?.map((course) => {
                return { label: `${course.id} - ${course.name}`, value: course.id };
              })}
              // binding value UI
              value={values.id || ""}
              // user bind value every typing text
              onChange={(text) => {
                // setValueCourse(text);
              }}
              // onSelect get value duoc selected
              onSelect={(valueSelect, option) => {
                //set giá trị của hộp thọa = option.label
                // setValueCourse(option.label);
                // get option and assign cho values.id of formik
                setFieldValue("id", valueSelect);
                let courseName = option.label.split('-')[1].trim()
                setFieldValue("name", courseName);
              }}
              style={{ width: "100%" }}
              onSearch={(searchText) => {
                setCourseOptions(
                  [
                    ...dataCourseDefault?.filter((course) =>
                      (course.name.includes(searchText) || course.id.includes(searchText))
                    ),
                  ].splice(0, 5)
                );
                setFieldValue("id", searchText);
              }}
              onBlur={(e) => {
                let isValid = dataCourseDefault?.some(course => course.id.includes(e.target.value))
                if(!isValid) {
                  setFieldValue("id", '');
                }
              }}
              disabled={props.editCirCourse.id}
            />
             <span className="text-danger">{errors.id}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">
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
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="credit">Credit:</label>
            <input
              name="credit"
              value={values.credit || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.credit}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {(props.editCirCourse && props.editCirCourse.id) ||
          (!props.isSemester && props.editCirCourse.id) ? (
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

const FormCirrCourseFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editCirCourse, selectedFolw, cirSemester, cirGroup} = props;
    let semesterName, groupName
    if(editCirCourse.isEdit) { //edit
      semesterName = cirSemester.data.find(semester => semester.id === editCirCourse.semesterId)?.name
      groupName = cirGroup.data.find(group => group.id === editCirCourse.groupId)?.name
    } else { //new
      if(editCirCourse.type) {
        semesterName = cirSemester.data.find(semester => semester.id === selectedFolw.cirSemesterId)?.name
        groupName = ''
      } else {
        groupName = cirGroup.data.find(group => group.id === selectedFolw.cirGroupId)?.name
        semesterName = ''
      }
    }
  
    return {
      programId: selectedFolw.programId,
      semesterId: selectedFolw?.cirSemesterId,
      semesterName: semesterName,
      groupId: selectedFolw?.cirGroupId,
      groupName: groupName,
      id: editCirCourse?.id,
      name: editCirCourse?.name,
      credit: editCirCourse?.credit,
      type: editCirCourse?.type,
      isEdit: editCirCourse?.isEdit,
    };
  },
  validationSchema: Yup.object().shape({
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    if(values.isEdit) {
      props.dispatch(editCirrCourseActionApi(values))
    }
    else {
      props.dispatch(addpostNewCirrCourseActionApi(values))
    }
  },
})(FormCirrCourse);

const mapStateToProps = (state) => ({
  editCirCourse: state.GeneralProgramReducer.editCirCourse,
  selectedFolw: state.GeneralProgramReducer.selectedFolw,
  isSemester: state.GeneralProgramReducer.isSemester,
  cirGroup: state.GeneralProgramReducer.cirGroup,
  cirSemester: state.GeneralProgramReducer.cirSemester,
  courseAutocomplete: state.GeneralProgramReducer.courseAutocomplete,
});

export default connect(mapStateToProps)(FormCirrCourseFormik);
