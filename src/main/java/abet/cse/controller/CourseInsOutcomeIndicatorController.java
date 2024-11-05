package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.matrix.CourseInsOutcomeIndicatorCell;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.model.CourseInsOutcome;
import abet.cse.model.ProgramIns;
import abet.cse.repository.CourseInsOutcomeRepo;
import abet.cse.repository.IndicatorRepo;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/course-instances/{courseId}/outcome-indicator")
@RequiredArgsConstructor
@Slf4j
public class CourseInsOutcomeIndicatorController {

  private final IndicatorRepo indicatorRepo;
  private final CourseInsOutcomeRepo courseInsOutcomeRepo;
  private final ProgramInsRepo programInsRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInstanceOutcomeIndicator(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId) {
    BaseResponse response;
    ProgramIns programIns = null;
    try {
      programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      List<CourseInsOutcome> courseInsOutcomeList = courseInsOutcomeRepo.
          findColumnByProgramInsIdAndCourseId(programIns.getId(), courseId);
      List<String> indicatorNameList = indicatorRepo.findNameByProgramId(programIns.getProgramId());

      List<MatrixRow> matrixRowList = new ArrayList<>();
      for (String indicatorName : indicatorNameList) {
        MatrixRow<CourseInsOutcomeIndicatorCell> matrixRow = new MatrixRow<>();

        List<CourseInsOutcomeIndicatorCell> peoOutcomeCellList = new ArrayList<>();
        for (CourseInsOutcome courseInsOutcome : courseInsOutcomeList) {
          Integer percent = indicatorName.equalsIgnoreCase(courseInsOutcome.getIndicatorName())
              ? courseInsOutcome.getPercentIndicator() : null;
          CourseInsOutcomeIndicatorCell cell = new CourseInsOutcomeIndicatorCell(
              courseInsOutcome.getName(), indicatorName, percent);
          peoOutcomeCellList.add(cell);
        }

        matrixRow.setTitle(indicatorName);
        matrixRow.setData(peoOutcomeCellList);
        matrixRowList.add(matrixRow);
      }

      List<String> outcomeNameList = courseInsOutcomeList.stream().map(CourseInsOutcome::getName)
          .collect(Collectors.toCollection(LinkedList::new));
      outcomeNameList.add(0, "");

      MatrixResponse matrixResponse = new MatrixResponse(outcomeNameList, matrixRowList);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      log.info("getCourseInstanceOutcomeIndicator SUCCESS with [ProgramInstance] {}, [BaseResponse] {}",
          ObjectUtils.toJsonString(programIns), ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseInstanceOutcomeIndicator ERROR with [ProgramInstance] {}, exception: ",
          ObjectUtils.toJsonString(programIns), ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postCourseInstanceOutcomeIndicator(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId, @RequestBody List<CourseInsOutcomeIndicatorCell> cellList) {
    BaseResponse response;
    ProgramIns programIns = null;
    try {
      programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      for (CourseInsOutcomeIndicatorCell cell : cellList) {
        String sql = "UPDATE course_outcome_instance SET indicator_name = ?, percent_indicator = ?"
          + " WHERE program_id = ? AND course_id = ? AND name = ?";
        jdbcTemplate.update(sql, cell.getIndicatorName(), cell.getPercentIndicator(), programIns.getId(), courseId, cell.getOutcomeName());
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("postCourseInstanceOutcomeIndicator SUCCESS with [ProgramInstance] {}, [BaseResponse] {}",
          ObjectUtils.toJsonString(programIns), ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postCourseInstanceOutcomeIndicator ERROR with [ProgramInstance] {}, exception: ",
          ObjectUtils.toJsonString(programIns), ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
