import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'antd';
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_COURSE_OUTCOME_INSTANCE } from "../../../../../../redux/types";
import FormCourseOutcomeInstance from "./form-outline-instance/FormCourseOutcomeInstance";
import { getCourseOutcomesOutlineInCourseInstanceActionApi } from "../../../../../../actions/api-actions/ProgramAction";


export default function OutlineOutcomesInstance() {
    const dispatch = useDispatch();
  const { selectedFlowProgramVersion, outcomesFromCourseOutlineInstance } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, courseId } = selectedFlowProgramVersion

  useEffect(() => {
    dispatch(getCourseOutcomesOutlineInCourseInstanceActionApi(programVersionInfo, courseId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "",
        dataIndex: "name",
        key: "name",
        width: "150px",
        fixed: "left",
      },
      {
        title: "",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "",
        dataIndex: "operation",
        key: "operation",
        width: "80px",
        fixed: "right",
        render: (text, record, index) => (
          <span className="d-flex justify-content-between align-items-center">
            <span
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT COURSE OUTLINE OUTCOMES",
                  Component: <FormCourseOutcomeInstance />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                const action2 = {
                  type: SET_EDIT_COURSE_OUTCOME_INSTANCE,
                  payload: {...record, isEdit: true}
                }
                dispatch(action2)
                //dispatch dữ liệu dòng hiện tai lên reducer
              }}
              className="btn-edit mr-3"
            >
              <i className="fa fa-edit"></i>
            </span>
          </span>
        ),
      },
    ];

    const data = record?.secondary?.map((outcomeChild) => {
      return { ...outcomeChild, key: outcomeChild.id };
    });

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "150px",
      fixed: "left",
    },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "CDIO", dataIndex: "cdio", key: "cdio" },
    {
      title: "Action",
      key: "operation",
      render: (record) => (
        <span className="d-flex justify-content-between align-items-center">
          <span
            onClick={() => {
              const action1 = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "EDIT COURSE OUTLINE OUTCOMES",
                Component: <FormCourseOutcomeInstance />,
              };

              //dispatch lên reducer nội dung drawer
              dispatch(action1);
              const action2 = {
                  type: SET_EDIT_COURSE_OUTCOME_INSTANCE,
                  payload: {...record, isEdit: true}
                }
                dispatch(action2)
              //dispatch dữ liệu dòng hiện tai lên reducer
            }}
            className="btn-edit mr-3"
          >
            <i className="fa fa-edit"></i>
          </span>
        </span>
      ),
      width: "80px",
      fixed: "right",
    },
  ];

  const data = outcomesFromCourseOutlineInstance?.data?.map((outcomeParent, idx) => {
    return { ...outcomeParent, key: idx + 1 };
  });

    return (
        <div className="wrapper-outcome">
      <Button className='mt-0' type="primary"
        onClick={() => {
          const action1 = {
            type: ADD_INFO_COURSE_DRAWER,
            title: "NEW COURSE OUTLINE OUTCOMES",
            Component: <FormCourseOutcomeInstance />,
          };

          //dispatch lên reducer nội dung drawer
          dispatch(action1);
          const action2 = {
              type: SET_EDIT_COURSE_OUTCOME_INSTANCE,
              payload: {isEdit: false}
            }
            dispatch(action2)
          //dispatch dữ liệu dòng hiện tai lên reducer
        }}
      >New</Button>
      <Table
        scroll={{ x: 992 }}
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={data}
      />
    </div>
    )
}
