import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Pagination, Button, Popconfirm } from "antd";
// https://codepen.io/marclundgren/pen/hgelI  link UI codepen
// import "./PGMatrixPeo.scss";
import { Select } from "antd";
import { deleteVersionSurveyResultActionApi, getVersionSurveyResultActionApi, getVersionSurveyResultAnswerOptionsActionApi, postImportFileSupervisorResultActionApi, postVersionSurveyResultActionApi } from "../../../../../../actions/api-actions/ProgramAction";
import SupervisorStat from "./SupervisorStat";
import ModalImport from "../../../../../../components/modal-import/ModalImport";
import { MemoizedTemplateSuperReview } from "../../../../../../components/modal-template/ModalTemplate";


const text = 'Are you sure to delete this task?';
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 1px 2px 8px 4px #eeeeee;
  color: rgba(0, 0, 0, 0.85);
  ${'' /* pointer-events: none; */}
`;
const Th = styled.th`
  background: #fafafa;
  color: rgba(0, 0, 0, 0.85);
  padding: 6px;
  border: 1px solid #eeeeee;
  text-align: center;
  width: 150px;
  height: 45px;
`;

const Td = styled.td`
  padding: 6px;
  border: 1px solid #eeeeee;
  text-align: center;
`;
const { Option } = Select;

const ButtonImport = () => {
  const [isShowModal, setShowModal] = useState(false)
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()
  const updateModalComp = (val) => {
    setShowModal(val)
  }
  const { selectedFlowProgramVersion } = useSelector((state) => state.GeneralProgramReducer);
  const { programVersionInfo, surveyName } = selectedFlowProgramVersion;

  const changeFile = (e) => {
    setFile(e.target.files[0])
  }
  const cancelImportFile = () => {
    setShowModal(false)
  }

  const saveImportFile = () => {
    let fileInfo = {
      sheet: 1,
      file: file,
    }
    let data = { programVersionInfo, surveyName, surveyType: 'supervisor', fileInfo }
    dispatch(postImportFileSupervisorResultActionApi(data))
    setShowModal(false)
    setFile(null)
    document.getElementById("file-supervisor").value = ''
  }

  return <div className="mr-4">
    <Button onClick={() => setShowModal(true)}>Import</Button>
    <ModalImport updateModal={updateModalComp} isVisible={isShowModal}
    >
      <MemoizedTemplateSuperReview />
      <div className="text-center mb-4">
        <input
          id="file-supervisor"
          onChange={changeFile}
          type='file'
          accept=".xls,.xlsx"
        />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Button onClick={() => saveImportFile()} className="mr-5" type="primary">Send</Button>
        <Button onClick={() => cancelImportFile()}>Cancel</Button>
      </div>
    </ModalImport>
  </div>
}

export default function Supervisor() {
  const [page, setPage] = useState(1);
  const [isEdit, setEdit] = useState(false);
  const { versionSurveyResult, versionSurveyResultAnswerOptions, selectedFlowProgramVersion } = useSelector((state) => state.GeneralProgramReducer);
  const { data } = versionSurveyResult;
  const [dataCell, setDataCell] = useState({ ...data })
  const [selectedCell, setSelectedCell] = useState({ indicatorName: null, studentId: null, empId: null })
  let [selectedCellArray, setSelectedCellArray] = useState([])

  const { programVersionInfo, surveyName } = selectedFlowProgramVersion;

  const dispatch = useDispatch();

  useEffect(() => {
    if (programVersionInfo, surveyName) {
      dispatch(getVersionSurveyResultActionApi(programVersionInfo, surveyName, 'supervisor', 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo, surveyName]);

  useEffect(() => {
    setDataCell({ ...data })
  }, [versionSurveyResult, data])

  const onChange = (page) => {
    setPage(page)
    dispatch(getVersionSurveyResultActionApi(programVersionInfo, surveyName, 'supervisor', page));
  };

  const getFoundationTestResultAnswer = (programVersionInfo, surveyName, eleCell) => {
    if ((+eleCell.empId == +selectedCell.empId) && (+eleCell.studentId == +selectedCell.studentId) && (eleCell.indicatorName === selectedCell.indicatorName)) return
    if (!isEdit) return
    dispatch(getVersionSurveyResultAnswerOptionsActionApi(programVersionInfo, surveyName, eleCell.surveyIndicatorId))
    setSelectedCell({ ...selectedCell, studentId: eleCell.studentId, empId: eleCell.empId, indicatorName: eleCell.indicatorName })
  }

  const renderAnswerList = () => {
    return versionSurveyResultAnswerOptions?.data?.map((item, idx) => {
      return (
        <Option title={item.description} value={item.levelId} key={idx}>
          {item.levelId}
        </Option>
      );
    });
  }

  const postMatrix = () => {
    let dataUpdate = { selectedCellArray: [...selectedCellArray], programVersionInfo, surveyName, surveyType: 'supervisor' }
    dispatch(postVersionSurveyResultActionApi(dataUpdate))
    setEdit(false)
  }

  const cancelMatrix = () => {
    dispatch(getVersionSurveyResultActionApi(programVersionInfo, surveyName, 'supervisor', 1));
    document.getElementById(
      "foundation-test-result"
    ).style.pointerEvents = "none";
    setPage(1)
    setEdit(false)
  }

  const confirm = (superviseId) => {
    let dataUpdate = { selectedRow: { superviseId: superviseId }, programVersionInfo, surveyName, surveyType: 'supervisor' }
    dispatch(deleteVersionSurveyResultActionApi(dataUpdate))
  }

  const changeSelectCell = (e, eleCell) => {
    let dataCellUpdate = { ...dataCell }
    let row = dataCellUpdate?.rowList?.find(item => +item.title == +eleCell.studentId && item.supervisor === eleCell.empId)
    let cell = row?.data?.find(item => item.indicatorName === eleCell.indicatorName)
    cell.mark = e
    setDataCell(dataCellUpdate)
    // keep draft cell changed data
    let isExisted = selectedCellArray.some(item => (item.indicatorName === cell.indicatorName))
    if (isExisted) {
      selectedCellArray = selectedCellArray.filter(item => item.indicatorName !== cell.indicatorName)
    }
    selectedCellArray.push(cell)
    setSelectedCellArray([...selectedCellArray])
  }

  return (
    <div className="matrix">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="">
            <FormattedMessage id="RESULT_SUPERVISOR" />
          </h5>
          <p className="text-danger"><FormattedMessage id="MATRIX_EDIT_NOTI" /></p>
        </div>

        <div className="d-flex justify-content-center align-items-center wrapper-icon">
          <ButtonImport />

          {!isEdit && <span
            title="click here to change matrix"
            onClick={() => {
              setEdit(true);
              document.getElementById(
                "foundation-test-result"
              ).style.pointerEvents = "auto";
            }}
            className="icon mr-3"
          >
            <i className="fa fa-edit"></i>
          </span>}
          {isEdit && <Button onClick={() => postMatrix()} type="primary" className='mr-3'>Save</Button>}
          {isEdit && <Button onClick={() => cancelMatrix()}>Cancel</Button>}
        </div>
      </div>
      {dataCell?.columnList?.length > 1 && dataCell?.rowList?.length > 0 ? (
        <div>
          <Table
            style={{
              display: 'block',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
            className="responsive-table-input-matrix"
          >
            <thead>
              <tr>
                {dataCell?.columnList.map((peo, idx) => {

                  return <Th key={idx}>{peo}</Th>;
                })}
              </tr>
            </thead>
            <tbody id="foundation-test-result">
              {dataCell?.rowList.map((row, rowIdx) => {
                row.superviseId = (((row || {}).data || [])[0] || {}).superviseId
                return (
                  <tr
                    id="matrix-foundation-result"
                    className={rowIdx % 2 === 0 ? "rowHighlight" : ""}
                    key={rowIdx}
                  >
                    <Td>{row.supervisor}</Td>
                    <Td>{row.title}</Td>
                    {dataCell?.rowList[rowIdx].data.map((eleCell, idx) => {
                      return (
                        <Td key={idx}>
                          {
                            isEdit ? <Select
                              onFocus={() => getFoundationTestResultAnswer(programVersionInfo, surveyName, eleCell)}
                              size="default"
                              value={eleCell.mark || ""}
                              onSelect={(e) => changeSelectCell(e, eleCell)}
                              style={{ width: "100%" }}
                              className="general-select-ant"
                              filterOption={(keyword, option) =>
                                option.children
                                  .toString()
                                  .toLowerCase()
                                  .includes(keyword.toLowerCase())
                              }
                            >
                              {renderAnswerList()}

                            </Select> : <span>{eleCell.mark}</span>
                          }
                        </Td>
                      );
                    })}
                    {isEdit && <Td style={{ padding: '0 20px', color: '#707070', cursor: 'pointer' }}><Popconfirm placement="topLeft" title={text} onConfirm={() => confirm(row.superviseId)} okText="Yes" cancelText="No"><span className='fa fa-trash-alt'></span></Popconfirm></Td>}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center my-3">
            <Pagination
              pageSize={20}
              current={page}
              total={versionSurveyResult.total}
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-danger">
          <FormattedMessage id="NO_DATA" />
        </div>
      )}
      <SupervisorStat />
    </div>
  );
}
