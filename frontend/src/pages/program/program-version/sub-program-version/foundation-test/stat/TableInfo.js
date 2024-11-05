import React from 'react'
import { exportTableToExcel } from './helpers';
import './stat.scss'
// https://www.codeproject.com/Questions/5255233/How-do-you-overflow-x-and-y-HTML-tables-using-CSS

export default function TableInfo({ data, id, isShow = true }) {
  const { header, rows } = data || {};
  if (!header || !rows) return null;

  return (<>
    {isShow && <div className='d-flex justify-content-end'>
      <button className="btn btn-outline-primary mx-1"
        onClick={() => exportTableToExcel(id, `Report-by-${id}`)}>Export Table</button>
    </div>}
    <table className='table-stat' id={id}>
      <thead>
        <tr>
          {
            header?.map((head, idx) => {
              return <th key={`${idx}-${head}`}>{head}</th>
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          rows?.map((row, index) => {
            return <tr key={index}>
              {
                row?.map((itm, i) => {
                  return <td key={`${itm.value}-${i}`} data-label={itm.name}>{itm.value}</td>
                })
              }
            </tr>
          })
        }
      </tbody>
    </table>
  </>)
}
