import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
// https://codepen.io/marclundgren/pen/hgelI  link UI codepen
import "./Class.scss";
import {
  programService,
} from "../../../../../../../services/ProgramService";
import { Select, Button } from "antd";
import { notifiFunction } from "../../../../../../../util/notification/Notification";
import { Popconfirm } from "antd";
import { MemoizedTemplateTestResult } from "../../../../../../../components/modal-template/ModalTemplate";
import ModalImport from "../../../../../../../components/modal-import/ModalImport";

const text = "Are you sure to delete this task?";

const { Option } = Select;

const ButtonImport = ( {outcomeId, testId, refreshMatrix} ) => {
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
      let result = await programService.postVersionCourseInstanceClassTestResult
      (testId, outcomeId, classId, formData)
      if (result && result.data && result.data.code > 0) {
        notifiFunction("success", "Post course successfully!")
      } else {
        notifiFunction("error", "Post course failed!")
      }
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
          <MemoizedTemplateTestResult />
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

export default function ClassTestResult() {
  const { selectedFlowProgramVersion } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const [data, setStateData] = useState({});
  const [optionList, setOptionList] = useState([])
  const [outcomeId, setOutcomeId] = useState(0)
  const [total, setTotal] = useState(0)
  const refFiles = useRef()

  const { testId, classId } = selectedFlowProgramVersion;

  const getTestOutcomes = async () => {
    try {
      let result = await programService.getVersionCourseInstanceTestOutcome(testId, 1, 1000)
      setOptionList(result);
      if(result && result.data && result.data.data) {
        let num = (result.data.data[0] || {}).courseOutcomeId
        setOutcomeId(num)
        getMatrix(testId, num, classId)
      }
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if(testId) getTestOutcomes()
  }, [testId]);

  const getMatrix = async (testId, outcomeId, classId) => {
    programService
      .getVersionCourseInstanceClassTestResult(testId, outcomeId, classId)
      .then((res) => {
        setTotal(res.data.data?.rowList?.length)
        setStateData(res.data.data);
      })
      .catch((e) => console.log(e));
  };

  const handleChange = (value) => {
    setOutcomeId(value);
  };

  const deleteGrading = async (cellInfo) => {
    try {
      let result = await programService.deleteVersionCourseInstanceClassTestResult(
        testId,
        outcomeId,
        cellInfo
      );
      if (result) {
        notifiFunction("success", "Delete course successfully!");
      }
      getMatrix(testId, outcomeId, classId);
    } catch (e) {
      notifiFunction("error", "Delete course failed!");
      console.log(e);
    }
  };

  const renderOptionList = () => {
    return optionList?.data?.data?.map((itm, idx) => {
      return (
        <Option
          title={itm.description}
          key={`${itm.courseOutcomeId}-${idx}`}
          value={itm.courseOutcomeId}
        >
          {itm.name} - {itm.description}
        </Option>
      );
    });
  };

  const confirm = (eleCell) => {
    deleteGrading(eleCell)
  }

  const refreshMatrix = () => {
    getMatrix(testId, outcomeId, classId)
  }

  return (
    <div className="matrix-class-test my-4">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h6 className="m-0">
          <Select
            className="mr-3"
            style={{ width: 250 }}
            onChange={handleChange}
            placeholder="Course outcome"
            value={outcomeId}
          >
            {renderOptionList()}
          </Select>

          <Button
            onClick={() => getMatrix(testId, outcomeId, classId)}
            className="mr-3"
            type="primary"
          >
            View
          </Button>
        </h6>
        <div className="wrapper-icon">
          <ButtonImport outcomeId={outcomeId} testId={testId} refreshMatrix={refreshMatrix} />
        </div>
      </div>
      {data?.columnList?.length > 1 && data?.rowList?.length > 0 ? (
        <div>
          <table
            id="matrix-peo-outcome"
            className="responsive-table-input-matrix"
          >
            <thead className='text-left' style={{ fontSize: "14px" }}>
              <tr>
                {data?.columnList.map((peo, idx) => {
                  return (
                    <th style={{ width: "120px" }} key={idx}>
                      {peo}{idx === 0 ? ` (${total})` : ''}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data?.rowList.map((row, rowIdx) => {
                return (
                  <tr
                    style={{ height: "32px" }}
                    className={rowIdx % 2 === 0 ? "rowHighlight" : ""}
                    key={rowIdx}
                  >
                    <td className='text-left' style={{ width: "120px", paddingLeft: '15px' }}>{row.title}</td>
                    {data?.rowList[rowIdx].data.map((eleCell, idx) => {
                      return (
                        <td
                          className="cell"
                          key={idx}
                          style={{ width: "120px", padding: '15px 10px', paddingLeft: '0'}} 
                        >
                          <span className="d-flex justify-content-between align-items-center">
                            <span>
                              {(eleCell || {}).score || "N/A"}
                            </span>
                            <Popconfirm
                              placement="topRight"
                              title={text}
                              onConfirm={() => confirm(eleCell)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <span
                                className="trash-bin-icon"
                                style={{ color: "#595959", cursor: "pointer" }}
                              >
                                <i className="fa fa-trash-alt"></i>
                              </span>
                            </Popconfirm>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-danger">
          <FormattedMessage id="NO_DATA" />
        </div>
      )}
    </div>
  );
}
