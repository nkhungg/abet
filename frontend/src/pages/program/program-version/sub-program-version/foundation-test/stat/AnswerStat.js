import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { programService } from '../../../../../../services/ProgramService';
import { convertTableData, exportChart, standardizeData } from './helpers';
import TableInfo from './TableInfo';
import TypeChartIcons from './TypeChartIcons';
import TypeCharts from './TypeCharts';

export default function AnswerStat() {

  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);
  const [datas, setDatas] = useState([]);
  let chartRef = useRef();

  const { programVersionInfo } = selectedFlowProgramVersion;

  const fetchData = async () => {
    if (!programVersionInfo) return;
    try {
      const res = await programService.getAnswerStat(programVersionInfo);
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

  const newData = datas.map(itm => {
    const questionInfo = itm.questionId?.split('_');
    return {...itm, pass: itm.count, name: +questionInfo[questionInfo.length - 1]}
  })

  const tableData = convertTableData(standardizeData(newData), 'answer', ['pass', 'passPercent', 'total', 'totalPercent']);

  return (
    <>
      <TypeChartIcons exportChart={() => exportChart(chartRef)} tab={'answer'} />
      <TypeCharts ref={chartRef} tab={'answer'} data={standardizeData(newData)} label={['count']} />
      <TableInfo id={`answer-table`} data={tableData} />
    </>
  )
}
