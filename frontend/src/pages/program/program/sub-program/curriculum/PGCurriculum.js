import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Menu, Dropdown } from "antd";
import actions from "../../../../../asset/images/actions.png";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import {
  getCirrGroupActionApi,
  getCirrSemesterActionApi,
} from "../../../../../actions/api-actions/ProgramAction";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_CUR_GROUP_ID,
  SET_CUR_SEMESTER_ID,
  SET_EDIT_CIR_GROUP,
  SET_EDIT_CIR_SEMESTER,
} from "../../../../../redux/types";
import FormCurriculum from "../../../../../components/form-curriculum/FormCurriculum";

export default function PGCurriculum() {
  const { selectedFolw } = useSelector((state) => state.GeneralProgramReducer);
  const { cirSemester } = useSelector((state) => state.GeneralProgramReducer);
  const { cirGroup } = useSelector((state) => state.GeneralProgramReducer);

  const dispatch = useDispatch();

  const { programId } = selectedFolw

  useEffect(() => {
    if(programId) {
      dispatch(getCirrSemesterActionApi(programId));
      dispatch(getCirrGroupActionApi(programId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const dataSemester = cirSemester?.data?.map((semester, idx) => {
    return {
      ...semester,
      key: idx + 1,
      programId: programId,
    };
  });

  const columnsSemester = [
    {
      title: "Stt",
      dataIndex: "key",
      fixed: 'left',
      key: "key",
      width: "55px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "60px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-between align-items-center">
          <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT SEMESTER",
                  Component: <FormCurriculum />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_CIR_SEMESTER,
                  payload: {...record, type: true},
                };
                dispatch(action2);
              }}
            >
              <i className="fa fa-edit"></i>
            </span>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_CUR_SEMESTER_ID,
                        payload: { id: record.id, type: true },
                      });
                    }}
                    key="1"
                  >
                    <NavLink
                      to={{
                        pathname: `/general-program/${selectedFolw.generalProgramId}/program/${selectedFolw.programId}/curriculum/semester-${record.id}/course`,
                        type: true,
                      }}
                    >
                      View Courses
                    </NavLink>
                  </Menu.Item>
                </Menu>
              }
              placement="topLeft"
            >
              <img
                className="mt-1 actions"
                src={actions}
                alt="action"
                width="20"
                height="20"
              />
            </Dropdown>
          </span>
        );
      },
    },
  ];

  const dataGroup = cirGroup?.data?.map((group, idx) => {
    return {
      ...group,
      key: idx + 1,
      programId: selectedFolw.programId,
    };
  });

  const columnsGroup = [
    {
      title: "Stt",
      dataIndex: "key",
      fixed: 'left',
      key: "key",
      width: "55px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "60px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-between align-items-center">
          <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT GROUP",
                  Component: <FormCurriculum />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_CIR_GROUP,
                  payload: {...record, type: false},
                };
                dispatch(action2);
              }}
            >
              <i className="fa fa-edit"></i>
            </span>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_CUR_GROUP_ID, 
                        payload: { id: record.id, type: false },
                      });
                    }}
                    key="1"
                  >
                    <NavLink
                      to={{
                        pathname: `/general-program/${selectedFolw.generalProgramId}/program/${selectedFolw.programId}/curriculum/group-${record.id}/course`,
                        type: false,
                        name: record.name
                      }}
                    >
                      Courses
                    </NavLink>
                  </Menu.Item>
                </Menu>
              }
              placement="topLeft"
            >
              <img
                className="mt-1 actions"
                src={actions}
                alt="action"
                width="20"
                height="20"
              />
            </Dropdown>
          </span>
        );
      },
    },
  ];

  return (
    <div className="mt-2 outcomes">
      <div className="row my-3">
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FormattedMessage id="CIR_SEMESTER" />
            </h5>
            <div className="wrapper-icon">
              <span
               onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "ADD NEW SEMESTER",
                  Component: <FormCurriculum />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_CIR_SEMESTER,
                  payload: {type: true},
                };
                dispatch(action2);
              }}
               className="icon mr-3">
                <i className="fa fa-plus"></i>
              </span>
              {/* <span className="icon mr-3">
                <i className="fa fa-columns"></i>
              </span> */}
              <span title="Refresh page" onClick={() => dispatch(getCirrSemesterActionApi(programId))} className="icon mr-3">
                <i className="fa fa-sync-alt"></i>
              </span>
              <span className="icon mr-3">
                <i className="fa fa-download"></i>
              </span>
            </div>
          </div>
          <Table
            className='my-3'
            pagination={false}
            columns={columnsSemester}
            dataSource={dataSemester}
          />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 mr-5">
              <FormattedMessage id="CIR_GROUPS" />
            </h5>
            <div
             className="wrapper-icon">
              <span onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "ADD NEW GROUP",
                  Component: <FormCurriculum />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_CIR_GROUP,
                  payload: {type: false},
                };
                dispatch(action2);
              }} className="icon mr-3">
                <i className="fa fa-plus"></i>
              </span>
              {/* <span className="icon mr-3">
                <i className="fa fa-columns"></i>
              </span> */}
              <span title="Refresh page" onClick={() => dispatch(getCirrGroupActionApi(programId)) } className="icon mr-3">
                <i className="fa fa-sync-alt"></i>
              </span>
              <span className="icon mr-3">
                <i className="fa fa-download"></i>
              </span>
            </div>
          </div>

          <Table
            className='my-3'
            pagination={false}
            columns={columnsGroup}
            dataSource={dataGroup}
          />
        </div>
      </div>
    </div>
  );
}
