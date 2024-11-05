import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";
import { getMatrixOutcomesIndicatorActionApi, postMatrixOutcomesIndicatorActionApi } from "../../../../../../actions/api-actions/ProgramAction";
import { useDispatch, useSelector } from "react-redux";
import '../../../ProgramVersion.scss'

export default function MaxtrixOutcomeIndicator() {
  const [isEdit, setEdit] = useState(false);
  const { selectedFlowProgramVersion, matrixCourseOutcomesIndicator } = useSelector((state) => state.GeneralProgramReducer);
  const { data } = matrixCourseOutcomesIndicator;
  const { programVersionInfo, courseId } = selectedFlowProgramVersion;
  const [dataCell, setDataCell] = useState(data)
  let [selectedCellArray, setSelectedCellArray] = useState([])
  
  const dispatch = useDispatch();

  useEffect(() => {
    if(!programVersionInfo || !courseId) return
    dispatch(getMatrixOutcomesIndicatorActionApi(programVersionInfo, courseId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    setDataCell({...data})
  }, [data])

  const classInput = isEdit ? 'enabled-edit' : 'active'

  const handleChange = (e, eleCell) => {
    let dataCellUpdate = {...dataCell}
    for(let row of dataCellUpdate?.rowList) {
      let isBreak = false
      for(let cell of row?.data) {
        if(cell.outcomeName === eleCell.outcomeName && cell.percentIndicator) {
          cell.percentIndicator = null
          isBreak = true
          break
        }
      } 
      if(isBreak) break 
    }
    let row = dataCellUpdate?.rowList?.find(item => item.title === eleCell.indicatorName)
    let cell = row?.data?.find(item => item.outcomeName === eleCell.outcomeName)
    cell.percentIndicator = e.target.value
    setDataCell(dataCellUpdate)
    let isExisted = selectedCellArray.some(item => (item.outcomeName === cell.outcomeName))
    if(isExisted) {
      selectedCellArray = selectedCellArray.filter(item => item.outcomeName !== cell.outcomeName)
    } 
    selectedCellArray.push(cell)
    setSelectedCellArray([...selectedCellArray])
  }

  const saveMatrix = () => {
    dispatch(postMatrixOutcomesIndicatorActionApi(programVersionInfo, courseId, selectedCellArray))
  }

  const cancelMatrix = () => {
    setDataCell({...data})
  }

  return (
    <div className="matrix-outcome-indicator my-2">
      <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
        <h5 className="m-0">
          <FormattedMessage id="MATRIX_OUTCOMES_INDICATOR" />
        </h5>
        <div className="wrapper-icon">
          {!isEdit && (
            <span
              title="click here to change matrix"
              onClick={() => {
                setEdit(true);
                document.getElementById(
                  "matrix-peo-outcome"
                ).style.pointerEvents = "auto";
              }}
              
              className="icon mr-3 cursor-poiter"
            >
              <i className="fa fa-edit"></i>
            </span>
          )}
          {isEdit && (
            <span
              title="click here to save"
              onClick={() => {
                setEdit(false);
                document.getElementById(
                  "matrix-peo-outcome"
                ).style.pointerEvents = "none";
              }}
             
              className="icon mr-3 text-danger cursor-poiter"
            >
              <i className="fa fa-times"></i>
            </span>
          )}

          <span className="icon mr-3 cursor-poiter">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3 cursor-poiter">
            <i className="fa fa-download"></i>
          </span>
        </div>
      </div>
      <div className='d-flex justify-content-between align-items-center mb-3'>
      <p className='text-danger'><FormattedMessage id="MATRIX_EDIT_NOTI" /></p>
      <div className='d-flex align-items-center'>
        <Button onClick={() => saveMatrix()} type="primary" className='mr-3'>Save</Button>
        <Button onClick={() => cancelMatrix()}>Cancel</Button>
      </div>
      </div>

      {dataCell?.columnList?.length > 1 && dataCell?.rowList?.length > 0 ? (
        <div>
          <table
            id="matrix-peo-outcome"
            className="responsive-table-input-matrix"
          >
            <thead className='header-outcome-indicator'>
              <tr className='text-center'>
                {dataCell?.columnList.map((peo, idx) => {
                  return <th className='py-2' style={{ border: '1px solid #e6e6e6', background: 'rgba(0,0,0,.04)'}} key={idx}>{peo}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {dataCell?.rowList.map((row, rowIdx) => {
                return (
                  <tr
                    className='text-center'
                    key={rowIdx}
                  >
                    <td className='w-110' style={{ border: '1px solid #e6e6e6'}}>{row.title}</td>
                    {dataCell?.rowList[rowIdx].data.map((eleCell, idx) => {
                      return (
                        <td style={{ border: '1px solid #e6e6e6'}} key={idx}>
                          <input 
                            id={`input-outcome-indicator-row-${rowIdx + 1}-col-${idx}`}
                            disabled={!isEdit} 
                            name='dataCell'
                            value={eleCell.percentIndicator || ''}
                            className={`w-100 text-center ${classInput}`} 
                            onChange={(e) => handleChange(e, eleCell)}
                            type='number'
                          />
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
