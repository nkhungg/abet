import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import {
  getMatrixPeoActionApi,
  postMatrixPeoActionApi,
} from "../../../../../actions/api-actions/ProgramAction";
import { Pagination } from "antd";
// https://codepen.io/marclundgren/pen/hgelI  link UI codepen
import "./PGMatrixPeo.scss";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 1px 2px 8px 4px #eeeeee;
  color: rgba(0, 0, 0, 0.85);
  pointer-events: none;
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

export default function PGMatrixPeo() {
  const [page, setPage] = useState(1);
  const [isEdit, setEdit] = useState(false);
  const { selectedFolw } = useSelector((state) => state.GeneralProgramReducer);
  const { maxtrixPeo } = useSelector((state) => state.GeneralProgramReducer);
  const { data } = maxtrixPeo;

  const dispatch = useDispatch();

  const { programId } = selectedFolw

  useEffect(() => {
    if(programId) {
      dispatch(getMatrixPeoActionApi(programId, 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const onChange = (page) => {
    if(programId) {
      dispatch(getMatrixPeoActionApi(programId, page));
    }
    setPage(page);
  };

  const postMaxtrixPeos = (postMaxtrixPeos) => {
    let peoOucome = { ...postMaxtrixPeos, isCheck: !postMaxtrixPeos.isCheck };
    dispatch(postMatrixPeoActionApi(programId, peoOucome, page));
  };

  return (
    <div className="matrix my-4">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h5 className="m-0">
          <FormattedMessage id="MATRIX_PEO" />
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
              className="icon mr-3"
            >
              <i className="fa fa-edit"></i>
            </span>
          )}
          {isEdit && (
            <span
              title="click here to change matrix"
              onClick={() => {
                setEdit(false);
                document.getElementById(
                  "matrix-peo-outcome"
                ).style.pointerEvents = "none";
              }}
              className="icon mr-3"
            >
              <i className="fa fa-times"></i>
            </span>
          )}

          <span className="icon mr-3">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3">
            <i className="fa fa-download"></i>
          </span>
        </div>
      </div>
      {data?.columnList?.length > 1 && data?.rowList?.length > 0 ? (
        <div>
          <Table
            id="matrix-peo-outcome"
            className="responsive-table-input-matrix"
          >
            <thead>
              <tr>
                {data?.columnList.map((peo, idx) => {
                  return <Th key={idx}>{peo}</Th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data?.rowList.map((row, rowIdx) => {
                return (
                  <tr
                    className={rowIdx % 2 === 0 ? "rowHighlight" : ""}
                    key={rowIdx}
                  >
                    <Td>{row.title}</Td>
                    {data?.rowList[rowIdx].data.map((eleCell, idx) => {
                      return (
                        <Td onClick={() => postMaxtrixPeos(eleCell)} key={idx}>
                          {eleCell.isCheck ? "X" : ""}
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
              total={maxtrixPeo.total}
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
