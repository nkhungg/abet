import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from "react-redux";
import { programService } from '../../../../../../services/ProgramService';
import TableInfo from './TableInfo';
import TypeChartIcons from './TypeChartIcons';
import { convertTableData, exportChart, standardizeData } from './helpers';
import TypeCharts from './TypeCharts';

export default function OutcomeStat() {
  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);
  const [datas, setDatas] = useState([]);
  let chartRef = useRef();

  const { programVersionInfo } = selectedFlowProgramVersion;

  const fetchData = async () => {
    if (!programVersionInfo) return;
    try {
      const res = await programService.getOutcomeStat(programVersionInfo);
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

  const newDatas = datas?.map(itm => {
    return {
      ...itm,
      name: itm.outcomeName,
    }
  })

  const tableData = convertTableData(standardizeData(newDatas), 'outcome', ['pass', 'passPercent', 'fail', 'failPercent', 'total', 'totalPercent']);

  return (
    <>
      <TypeChartIcons exportChart={() => exportChart(chartRef)} tab={'outcome'} />
      <TypeCharts ref={chartRef} tab={'outcome'} data={standardizeData(newDatas)} label={['Pass Percent', 'Fail Percent']} />
      <TableInfo id={`outcome-table`} data={tableData} />
    </>
  )
}
