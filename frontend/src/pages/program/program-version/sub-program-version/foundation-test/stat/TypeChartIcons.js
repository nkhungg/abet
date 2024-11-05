import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import stacked from '../../../../../../asset/images/stacked.png';
import { SET_TYPE_CHART } from '../../../../../../redux/types';

const icons = [
  { name: 'fa fa-poll', id: 1, type: 'verticle-bar' },
  { name: 'fa fa-poll-h', id: 2, type: 'horizontal-bar' },
  { name: 'fa fa-chart-pie', id: 3, type: 'pie' },
]

export default function TypeChartIcons({ tab = 'subject', exportChart }) {
  const dispatch = useDispatch();
  const {
    typeChart,
  } = useSelector((state) => state.GeneralProgramReducer);

  const changeTypeChart = (val) => {
    dispatch({
      type: SET_TYPE_CHART,
      payload: val
    })
  }

  const isHidePie = (type) => {
    return (tab === 'subject' || tab === 'outcome' || tab === 'indicator') && type === 'pie'
  }

  const isShowStack = (tab === 'subject' || tab === 'outcome' || tab === 'indicator');

  return (
    <div className='d-flex align-items-center justify-content-end'>
      {
        icons.map(icon => {
          return <span
            onClick={() => changeTypeChart(icon.type)}
            key={icon.id}
            className='mr-1 px-2 py-0'
            style={{
              fontSize: '30px',
              cursor: 'pointer',
              background: `${typeChart === icon.type ? '#aff4f9' : ''}`,
              display: `${isHidePie(icon.type) ? 'none' : ''}`
            }}>
            <i className={icon.name}></i>
          </span>
        })
      }
      {isShowStack && <span
        onClick={() => changeTypeChart('stacked-bar')}
        className='p-2'
        style={{ cursor: 'pointer', background: `${typeChart === 'stacked-bar' ? '#aff4f9' : ''}` }}>
        <img src={stacked} alt='verticle' width='30' height='30' />
      </span>}
      <button onClick={exportChart} type="button" className="btn btn-outline-primary mx-1">Export Chart</button>
    </div>
  )
}
