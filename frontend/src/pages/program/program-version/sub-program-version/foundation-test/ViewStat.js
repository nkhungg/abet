import { Tabs } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { SET_TYPE_CHART } from '../../../../../redux/types';
import AnswerStat from './stat/AnswerStat';
import GradeStat from './stat/GradeStat';
import IndicatorStat from './stat/IndicatorStat';
import OutcomeStat from './stat/OutcomeStat';
import SubjectStat from './stat/SubjectStat';
import YearStat from './stat/YearStat';
const { TabPane } = Tabs;

export default function ViewStat() {
  const dispatch = useDispatch();
  
  function callback(key) {
    dispatch({
      type: SET_TYPE_CHART,
      payload: 'verticle-bar'
    })
  }

  return (
    <div>
      <Tabs onChange={callback} defaultActiveKey="1">
        <TabPane tab="Subjects" key="1">
          <SubjectStat />
        </TabPane>
        <TabPane tab="Grade" key="2">
          <GradeStat />
        </TabPane>
        <TabPane tab="Year" key="3">
          <YearStat />
        </TabPane>
        <TabPane tab="Answer" key="4">
          <AnswerStat />
        </TabPane>
        <TabPane tab="Outcome" key="5">
          <OutcomeStat />
        </TabPane>
        <TabPane tab="Indicator" key="6">
          <IndicatorStat />
        </TabPane>
      </Tabs>
    </div>
  )
}
