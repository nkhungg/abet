import React, { useEffect } from "react";
import { Table, Button } from "antd";
import { ADD_INFO_COURSE_DRAWER, SET_DETAILS_IN_COURSE_OUTLINE_INSTANCE } from '../../../../../../redux/types';
import FormDetailsInstance from './form-outline-instance/FormDetailsInstance';
import ReactHtmlParser from "react-html-parser";
import { useDispatch, useSelector } from "react-redux";
import { getOutlineDetailFromCourseInstanceActionApi } from "../../../../../../actions/api-actions/ProgramAction";

export default function OutlineDetailsInstance() {
    const dispatch = useDispatch();
  const { selectedFlowProgramVersion, outlineDetailFromCourseInstance } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const { programVersionInfo, courseId } = selectedFlowProgramVersion
  useEffect(() => {
    dispatch(getOutlineDetailFromCourseInstanceActionApi(programVersionInfo, courseId, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = outlineDetailFromCourseInstance?.data?.map((courseDetail) => {
    return { ...courseDetail, key: courseDetail.id };
  });

  const columns = [
    {
      title: "Chapter",
      dataIndex: "chapter",
      key: "chapter",
      width: "100px",
      fixed: "left",
    },
    {
      title: "Content",
      dataIndex: "content",
      width: "400px",
      key: "content",
      render: (text, record, index) => {
        let contentJSX = ReactHtmlParser(text);
        return <div>{contentJSX}</div>;
      },
    },
    {
      title: "Output standard",
      dataIndex: "outputStandard",
      key: "outputStandard",
      width: "450px",
      render: (text, record, index) => {
        let contentJSX = ReactHtmlParser(text);
        return <div>{contentJSX}</div>;
      },
    },
    {
      title: "Review action",
      dataIndex: "reviewAction",
      key: "reviewAction",
      // width: "150px",
      render: (text, record, index) => {
        let contentJSX = ReactHtmlParser(text);
        return <div>{contentJSX}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      key: "operation",
      width: "80px",
      fixed: "right",
      render: (text, record, index) => (
        <span className="d-flex justify-content-center align-items-center">
          <span
            onClick={() => {
              const action1 = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "EDIT COURSE OUTLINE OUTCOMES",
                Component: <FormDetailsInstance />,
                width: 600,
              };
              //dispatch lên reducer nội dung drawer
              dispatch(action1);

              const action2 = {
                type: SET_DETAILS_IN_COURSE_OUTLINE_INSTANCE,
                payload: { ...record, isEdit: true },
              };
              dispatch(action2);
              //dispatch dữ liệu dòng hiện tai lên reducer
            }}
            className="btn-edit mr-3"
            style={{ fontSize: '16px'}}
          >
            <i className="fa fa-edit"></i>
          </span>
        </span>
      ),
    },
  ];

    return (
        <div className="course-outline-detail">
      <Button
        onClick={() => {
              const action1 = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "NEW COURSE OUTLINE OUTCOMES",
                Component: <FormDetailsInstance />,
                width: 600,
              };
              //dispatch lên reducer nội dung drawer
              dispatch(action1);

              const action2 = {
                type: SET_DETAILS_IN_COURSE_OUTLINE_INSTANCE,
                payload: { isEdit: false, type: 1},
              };
              dispatch(action2);
              //dispatch dữ liệu dòng hiện tai lên reducer
            }}
       type="primary" className="mb-2">Add new</Button>
      <Table
        sticky={true}
        scroll={{ x: 992, y: '50vh'}}
        pagination={false}
        columns={columns}
        dataSource={data}
      />
    </div>
    )
}
