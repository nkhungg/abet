import React from "react";
import { FormattedMessage } from "react-intl";
import { Tabs } from "antd";
import Subjects from "./Subjects";
import Questions from "./Questions";
import Results from "./Results";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;

export default function FoundationTest() {
  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo } = selectedFlowProgramVersion;

  const ViewStat = () => {
    window.location.pathname = `program-version/${programVersionInfo}/foundation-test/stat`
  }

  return (
    <div className="mt-2 outcomes">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0 mr-5">
          <FormattedMessage id="FOUNDATION_TEST" />
        </h5>
        <button type="submit" className="btn btn-primary mr-2" onClick={() => ViewStat()}>
          View results
        </button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Subjects" key="1">
          <Subjects />
        </TabPane>
        <TabPane tab="Questions" key="2">
          <Questions />
        </TabPane>
        <TabPane tab="Results" key="3">
          <Results />
        </TabPane>
      </Tabs>
    </div>
  );
}