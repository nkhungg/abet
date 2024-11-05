import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { programService } from '../../../../../../services/ProgramService';
import { convertTableData, convertYear, exportChart } from './helpers';
import TableInfo from './TableInfo';
import TypeChartIcons from './TypeChartIcons';
import TypeCharts from './TypeCharts';

export default function GradeStat() {
  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);
  const [datas, setDatas] = useState([]);
  const [details, setDetails] = useState([]);
  const [grade, setGrade] = useState(null);
  let chartRef = useRef();

  const { programVersionInfo } = selectedFlowProgramVersion;

  const fetchData = async () => {
    if (!programVersionInfo) return;
    try {
      const res = await programService.getGradeStat(programVersionInfo);
      setDatas(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchYearByGrade = async (selectedGrade) => {
    if (!programVersionInfo || !selectedGrade) return;
    try {
      const res = await programService.getYearByGradeStat(programVersionInfo, selectedGrade);
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
    return Array.from(Array(11).keys()).map(i => {
      return {
        name: i,
        count: datas.find(itm => itm.grade === i)?.count ?? 0
      }
    })
  };

  const tableData = convertTableData(standardizeData(), 'grade', ['count']);

  const hanldeClick = async (evt, element) => {
    const idx = element[0]?.index;
    if (!idx) return;
    const selectedGrade = (tableData?.rows[0] || [])[idx + 1]?.name;
    if (!selectedGrade) return;
    setGrade(selectedGrade);
    fetchYearByGrade(selectedGrade);
  };

  const standardizeDetail = () => {
    const result = details?.map(itm => {
      return {
        ...itm,
        name: +convertYear(itm.year),
      }
    })
    result.sort((a, b) => +a.name - +b.name);
    return result;
  };

  return (
    <>
      <TypeChartIcons exportChart={() => exportChart(chartRef)} tab={'grade'} />
      <TypeCharts hanldeClick={hanldeClick} ref={chartRef} tab={'grade'} data={standardizeData()} label={['count']} />
      <TableInfo id={`grade-table`} data={tableData} />

      { details?.length &&
        <div>
          <span className='font-weight-bold'>RATE OF {grade} POINT EVERY YEAR</span>
          <TypeCharts tab={'year'} data={standardizeDetail()} label={['count']} />
          <TableInfo data={convertTableData(standardizeDetail(), 'year', ['count'])} isShow={false} />
        </div>
      }
    </>
  );
}
