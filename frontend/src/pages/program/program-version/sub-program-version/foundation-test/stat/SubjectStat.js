import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from "react-redux";
import { programService } from '../../../../../../services/ProgramService';
import TableInfo from './TableInfo';
import TypeChartIcons from './TypeChartIcons';
import { convertTableData, exportChart, standardizeData } from './helpers';
import TypeCharts from './TypeCharts';

export default function SubjectStat() {
  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);
  const [datas, setDatas] = useState([]);
  let chartRef = useRef();

  const { programVersionInfo } = selectedFlowProgramVersion;

  const fetchData = async () => {
    if (!programVersionInfo) return;
    try {
      const res = await programService.getSubjectStat(programVersionInfo);
      setDatas(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (programVersionInfo) {
      fetchData();
    }
  }, [programVersionInfo]);

  const tableData = convertTableData(standardizeData(datas), 'subject', ['pass', 'passPercent', 'fail', 'failPercent', 'total', 'totalPercent']);

  return (
    <>
      <TypeChartIcons exportChart={() => exportChart(chartRef)} tab={'subject'} />
      <TypeCharts ref={chartRef} tab={'subject'} data={standardizeData(datas)} label={['Pass Percent', 'Fail Percent']} />
      <TableInfo id={`subject-table`} data={tableData} />
    </>
  );
}
