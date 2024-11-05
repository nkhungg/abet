import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { programService } from '../../../../../../services/ProgramService';
import { convertTableData, convertYear, exportChart } from './helpers';
import TableInfo from './TableInfo';
import TypeChartIcons from './TypeChartIcons';
import TypeCharts from './TypeCharts';

export default function YearStat() {
  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);
  const [datas, setDatas] = useState([]);
  const [details, setDetails] = useState([]);
  let chartRef = useRef();
  const [year, setyear] = useState(null);

  const { programVersionInfo } = selectedFlowProgramVersion;

  const fetchData = async () => {
    if (!programVersionInfo) return;
    try {
      const res = await programService.getYearStat(programVersionInfo);
      setDatas(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchGradeByYear = async (selectedYear) => {
    if (!programVersionInfo || !selectedYear) return;
    try {
      const res = await programService.getGradeByYearStat(programVersionInfo, selectedYear);
      setDetails(res.data.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (programVersionInfo) {
      fetchData();
    }
  }, [programVersionInfo]);

  const standardizeData = () => {
    const result = datas.map(itm => {
      return {
        ...itm,
        name: +convertYear(itm.year),
      }
    })
    result.sort((a, b) => +a.name - +b.name);
    return result;
  };

  const tableData = convertTableData(standardizeData(), 'year', ['count']);

  const hanldeClick = async (evt, element) => {
    const idx = element[0]?.index;
    if (!idx) return;
    const selectedYear = (tableData?.rows[0] || [])[idx + 1]?.name;
    if (!selectedYear) return;
    setyear(selectedYear);
    fetchGradeByYear(selectedYear);
  };

  const standardizeDetail = () => {
    return Array.from(Array(11).keys()).map(i => {
      return {
        name: i,
        count: details.find(itm => itm.grade === i)?.count ?? 0
      }
    })
  };

  return (
    <>
      <TypeChartIcons exportChart={() => exportChart(chartRef)} tab={'year'} />
      <TypeCharts hanldeClick={hanldeClick} ref={chartRef} tab={'year'} data={standardizeData()} label={['count']} />
      <TableInfo id={`year-table`} data={tableData} />

      {details?.length && year && <div>
        <span className='font-weight-bold'>RATE OF POINTS BY YEAR {year}</span>
        <TypeCharts tab={'grade'} data={standardizeDetail()} label={['count']} />
        <TableInfo data={convertTableData(standardizeDetail(), 'grade', ['count'])} isShow={false} />
      </div>}
    </>
  );
}
