import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from "react-redux";
import { programService } from '../../../../../../services/ProgramService';
import TableInfo from './TableInfo';
import TypeChartIcons from './TypeChartIcons';
import { convertTableData, exportChart, standardizeData } from './helpers';
import TypeCharts from './TypeCharts';

export default function IndicatorStat() {
  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);
  const [datas, setDatas] = useState([]);
  let chartRef = useRef();

  const { programVersionInfo } = selectedFlowProgramVersion;

  const fetchData = async () => {
    if (!programVersionInfo) return;
    try {
      const res = await programService.getIndicatorStat(programVersionInfo);
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
      name: itm.indicatorName,
    }
  })

  const tableData = convertTableData(standardizeData(newDatas), 'indicator', ['pass', 'passPercent', 'fail', 'failPercent', 'total', 'totalPercent']);

  return (
    <>
      <TypeChartIcons exportChart={() => exportChart(chartRef)} tab={'indicator'} />
      <TypeCharts ref={chartRef} tab={'indicator'} data={standardizeData(newDatas)} label={['Pass Percent', 'Fail Percent']} />
      <TableInfo id={`indicator-table`} data={tableData} />
    </>
  )
}
