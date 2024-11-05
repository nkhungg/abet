import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Tabs, Button } from "antd";
import { useSelector, useDispatch } from 'react-redux'
import OutlineGeneral from "./OutlineGeneral";
import OutlineDescription from "./OutlineDescription";
import OutlineGoals from "./OutlineGoals";
import OutlineMaterials from "./OutlineMaterials";
import OutlineOutcomes from "./OutlineOutcomes";
import OutlineStudy from "./OutlineStudy";
import OutlineLecturers from "./OutlineLecturers";
import OutlineDetails from "./OutlineDetails";
import OutlineContact from "./OutlineContact";
import { getCourseOutlineActionApi } from "../../../../../../../actions/api-actions/ProgramAction";
import { programService } from '../../../../../../../services/ProgramService'

const { TabPane } = Tabs;

export default function CourseOutline() {


  const { selectedFolw } = useSelector((state) => state.GeneralProgramReducer);
  const dispatch = useDispatch();

  const {programId, cirCourseId} = selectedFolw

  useEffect(() => {
    if(programId && cirCourseId) {
      dispatch(getCourseOutlineActionApi(programId, cirCourseId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId, cirCourseId]);

  const exportToWord = async (filename = '') => {
    let contentHTML = ''
    try {
      let result = await programService.getExportToWord(programId, cirCourseId)
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
        <Button onClick={() => exportToWord(`course-outline-${cirCourseId}`)} type='primary'><i className="fa fa-file-export mr-2"></i>Export to Word</Button>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="General" key="1">
          <OutlineGeneral />
        </TabPane>
        <TabPane tab="Description" key="2">
          <OutlineDescription />
        </TabPane>
        <TabPane tab="Study goals" key="3">
          <OutlineGoals />
        </TabPane>
        <TabPane tab="Materials" key="4">
          <OutlineMaterials />
        </TabPane>
        <TabPane tab="Outcomes" key="5">
          <OutlineOutcomes />
        </TabPane>
        <TabPane tab="How to study" key="6">
          <OutlineStudy />
        </TabPane>
        <TabPane tab="Expected Lecturers " key="7">
          <OutlineLecturers />
        </TabPane>
        <TabPane tab="Details" key="8">
          <OutlineDetails />
        </TabPane>
        <TabPane tab="Contact" key="9">
          <OutlineContact />
        </TabPane>
      </Tabs>
    </div>
  );
}
