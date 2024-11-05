import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Pagination, Button } from "antd";
import { getVersionFoundationTestResultActionApi, getVersionFoundationTestResultAnswerActionApi, postVersionFoundationTestResultActionApi } from "../../../../../actions/api-actions/ProgramAction";
// https://codepen.io/marclundgren/pen/hgelI  link UI codepen
// import "./PGMatrixPeo.scss";
import { Select } from "antd";
import { notifiFunction } from "../../../../../util/notification/Notification";
import { MemoizedTemplateFoundationTestResult } from "../../../../../components/modal-template/ModalTemplate";
import ModalImport from "../../../../../components/modal-import/ModalImport";
import { programService } from "../../../../../services/ProgramService";

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

const ButtonImport = ( {programVersionInfo, refreshMatrix} ) => {
  const [isShowModal, setShowModal] = useState(false)
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()
  const updateModalComp = (val) => {
      setShowModal(val)
  }
  const { selectedFlowProgramVersion } = useSelector((state) => state.GeneralProgramReducer);
  const { classId } = selectedFlowProgramVersion;

  const changeFile = (e) => {
      setFile(e.target.files[0])
  }
  const cancelImportFile = () => {
      setShowModal(false)
  }

  const postFile = async (file) => {
    try {
      let formData = new FormData()
      formData.append('file', file)
      let result = await programService.importFileVersionFoundationTestResult
      (programVersionInfo, formData)
      if (result && result.data && result.data.code > 0) {
        notifiFunction("success", "Post course successfully!")
      } else {
        notifiFunction("error", "Post course failed!")
      }
      refreshMatrix()
    } catch(e) {
      notifiFunction("error", "Post course failed!")
      console.log(e)
    }
  }

  const saveImportFile = () => {
    postFile(file)
    setFile(null)
    setShowModal(false)
    refreshMatrix()
    document.getElementById("file-ce-participant").value = ''
  }

  return <div className="mr-4">
      <Button onClick={() => setShowModal(true)}>Import</Button>
      <ModalImport updateModal={updateModalComp} isVisible={isShowModal}
      >
          <MemoizedTemplateFoundationTestResult />
          <div className="text-center mb-4">
              <input
                  id="file-ce-participant"
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

export default function Results() {
  const [page, setPage] = useState(1);
  const [isEdit, setEdit] = useState(false);
  const { versionFoundationTestResult, versionFoundationTestResultAnswer } = useSelector((state) => state.GeneralProgramReducer);
  const { data } = versionFoundationTestResult;
  const [dataCell, setDataCell] = useState({ ...data })
  const [selectedCell, setSelectedCell] = useState({ questionName: null, studentId: null })
  let [selectedCellArray, setSelectedCellArray] = useState([])

  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo } = selectedFlowProgramVersion;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVersionFoundationTestResultActionApi(programVersionInfo, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo]);

  useEffect(() => {
    setDataCell({ ...data })
  }, [data])

  const onChange = (page) => {
    dispatch(getVersionFoundationTestResultActionApi(programVersionInfo, page));
    setPage(page);
  };

  const getFoundationTestResultAnswer = (programVersionInfo, eleCell) => {
    if ((+eleCell.studentId === +selectedCell.studentId) && (+eleCell.questionName === +selectedCell.questionName)) return
    if (!isEdit) return
    dispatch(getVersionFoundationTestResultAnswerActionApi(programVersionInfo, eleCell.questionName))
    setSelectedCell({ ...selectedCell, studentId: eleCell.studentId, questionName: eleCell.questionName })
  }

  const renderAnswerList = () => {
    return versionFoundationTestResultAnswer?.data?.map((item, idx) => {
      return (
        <Option value={item.answerId} key={idx}>
          {item.answerId}
        </Option>
      );
    });
  }

  const saveMatrix = () => {
    let dataUpdate = { selectedCellArray: [...selectedCellArray], programVersionInfo }
    dispatch(postVersionFoundationTestResultActionApi(dataUpdate))
  }

  const cancelMatrix = () => {
    setEdit(false);
    document.getElementById(
      "foundation-test-result"
    ).style.pointerEvents = "none";
    dispatch(getVersionFoundationTestResultActionApi(programVersionInfo, 1));
    setPage(1)
    setEdit(false)
  }
  const changeSelectCell = (e, eleCell) => {
    let dataCellUpdate = { ...dataCell }
    for (let row of dataCellUpdate?.rowList) {
      let isBreak = false
      for (let cell of row?.data) {
        if (cell.outcomeName === eleCell.outcomeName && cell.percentIndicator) {
          cell.percentIndicator = null
          isBreak = true
          break
        }
      }
      if (isBreak) break
    }
    let row = dataCellUpdate?.rowList?.find(item => item.title === eleCell.studentId)
    let cell = row?.data?.find(item => item.questionName === eleCell.questionName)
    cell.answer = e
    setDataCell(dataCellUpdate)
    // keep draft cell changed data
    let isExisted = selectedCellArray.some(item => (item.questionName === cell.questionName))
    if (isExisted) {
      selectedCellArray = selectedCellArray.filter(item => item.questionName !== cell.questionName)
    }
    selectedCellArray.push(cell)
    setSelectedCellArray([...selectedCellArray])
  }

  console.log('versionFoundationTestResult', versionFoundationTestResult);
  const refreshMatrix = () => {
    dispatch(getVersionFoundationTestResultActionApi(programVersionInfo, 1));
  }
  return (
    <div className="matrix">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="">
            <FormattedMessage id="RESULT" />
          </h5>
          <p className="text-danger"><FormattedMessage id="MATRIX_EDIT_NOTI" /></p>
        </div>

        <div className="wrapper-icon d-flex justify-content-center align-items-center">
          <ButtonImport programVersionInfo={programVersionInfo} refreshMatrix={refreshMatrix} />
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
          {isEdit && <Button onClick={() => saveMatrix()} type="primary" className='mr-3'>Save</Button>}
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
                return (
                  <tr
                    id="matrix-foundation-result"
                    className={rowIdx % 2 === 0 ? "rowHighlight" : ""}
                    key={rowIdx}
                  >
                    <Td>{row.title}</Td>
                    {dataCell?.rowList[rowIdx].data.map((eleCell, idx) => {
                      return (
                        <Td key={idx}>
                          {
                            isEdit ? <Select
                              onFocus={() => getFoundationTestResultAnswer(programVersionInfo, eleCell)}
                              size="default"
                              value={eleCell.answer || ""}
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
                            </Select> : <span>{eleCell.answer}</span>
                          }

                        </Td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center my-3">
            <Pagination
              pageSize={15}
              current={page}
              total={versionFoundationTestResult.total}
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-danger">
          <FormattedMessage id="NO_DATA" />
        </div>
      )}
    </div>
  );
}
