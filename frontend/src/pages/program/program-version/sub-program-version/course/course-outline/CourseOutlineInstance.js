import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Tabs, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getCourseInstanceOutlineActionApi } from "../../../../../../actions/api-actions/ProgramAction";

import OutlineGeneralInstance from './OutlineGeneralInstance'
import OutlineDescriptionInstance from './OutlineDescriptionInstance'
import OutlineGoalsInstance from './OutlineGoalsInstance'
import OutlineMaterialsInstance from './OutlineMaterialsInstance'
import OutlineOutcomesInstance from './OutlineOutcomesInstance'
import OutlineStudyInstance from './OutlineStudyInstance'
import OutlineLecturersInstance from './OutlineLecturersInstance'
import OutlineDetailsInstance from './OutlineDetailsInstance'
import OutlineContactInstance from './OutlineContactInstance'
import { programService } from '../../../../../../services/ProgramService'

const { TabPane } = Tabs;

export default function CourseOutlineInstance() {
  const { selectedFlowProgramVersion } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const dispatch = useDispatch();

  const { programVersionInfo, courseId } = selectedFlowProgramVersion;

  useEffect(() => {
    if (!programVersionInfo || !courseId) return;
    dispatch(getCourseInstanceOutlineActionApi(programVersionInfo, courseId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo, courseId]);

  const exportToWord = async (filename = '') => {
    let contentHTML = ''
    try {
      let result = await programService.getExportToWordInstance(programVersionInfo, courseId)
      if(result) contentHTML = result.data
    } catch(err) {
      console.log('err', err);
    }

    var blob = new Blob(['\ufeff', contentHTML], {
        type: 'application/msword'
    });
    
    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(contentHTML);
    
    // Specify file name
    filename = filename?filename+'.doc':'document.doc';
    
    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = url;
        
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
    document.body.removeChild(downloadLink);
  }

  return (
    <div className="mt-2 outcomes">
    <div className="d-flex justify-content-between align-items-center">
      <h5 className="mb-0 mr-5">
        <FormattedMessage id="OUTLINE" />
      </h5>
      <Button onClick={() => exportToWord(`course-instance-outline-${courseId}`)} type='primary'><i className="fa fa-file-export mr-2"></i>Export to Word</Button>
    </div>
    <Tabs defaultActiveKey="1">
      <TabPane tab="General" key="1">
        <OutlineGeneralInstance />
      </TabPane>
      <TabPane tab="Description" key="2">
        <OutlineDescriptionInstance />
      </TabPane>
      <TabPane tab="Study goals" key="3">
        <OutlineGoalsInstance />
      </TabPane>
      <TabPane tab="Materials" key="4">
        <OutlineMaterialsInstance />
      </TabPane>
      <TabPane tab="Outcomes" key="5">
        <OutlineOutcomesInstance />
      </TabPane>
      <TabPane tab="How to study" key="6">
        <OutlineStudyInstance />
      </TabPane>
      <TabPane tab="Expected Lecturers " key="7">
        <OutlineLecturersInstance />
      </TabPane>
      <TabPane tab="Details" key="8">
        <OutlineDetailsInstance />
      </TabPane>
      <TabPane tab="Contact" key="9">
        <OutlineContactInstance />
      </TabPane>
    </Tabs>
  </div>
  );
}
