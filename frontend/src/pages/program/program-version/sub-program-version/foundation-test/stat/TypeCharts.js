import React, { memo, forwardRef } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { convertChartData, convertTableData } from './helpers';
import { useSelector } from 'react-redux';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TypeCharts = ({ tab, data, label, hanldeClick }, ref) => {
  const {
    typeChart,
  } = useSelector((state) => state.GeneralProgramReducer);

  const options = {
    indexAxis: typeChart === 'horizontal-bar' ? 'y' : undefined,
    responsive: true,
    plugins: {
      legend: {
        position: typeChart === 'verticle-bar' ? 'top' : (typeChart === 'horizontal-bar' ? 'right' : undefined),
      },
      title: {
        display: true,
        text: `Report by ${tab}`,
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          labelPointStyle: function (context) {
            return {
              pointStyle: 'triangle',
              rotation: 0,
            };
          },
          title: function (ele) {
            const currentLabel = ele[0]?.label;
            if (!currentLabel) return;
            if (tab === 'outcome' || tab === 'indicator') {
              const ele = data?.find(ele => (tab === 'outcome' ? ele?.outcomeName : ele?.indicatorName) === currentLabel);
              return `${currentLabel}: ${ele?.description}`;
            }
            return currentLabel;
          }
        }
      }
    },
    scales: typeChart === 'stacked-bar' ? {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    } : undefined,
  };

  return (
    <>
      {
        typeChart === 'pie' ? <div className='d-flex justify-content-center' style={{ width: '50%' }}>
          <Pie options={{ onClick: hanldeClick }} ref={ref} data={convertChartData(data, label, true)} />
        </div> : <Bar ref={ref} options={{ ...options, onClick: hanldeClick }} data={convertChartData(data, label)} />
      }
    </>
  )
}

export default memo(forwardRef(TypeCharts));