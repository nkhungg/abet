package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.dto.matrix.OutcomeCourseCell;
import abet.cse.model.Course;
import abet.cse.model.Outcome;
import abet.cse.model.OutcomeCourse;
import abet.cse.repository.CourseRepo;
import abet.cse.repository.OutcomeCourseRepo;
import abet.cse.repository.OutcomeRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import abet.cse.validator.Validator;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("programs/{programId}/outcome-course")
@RequiredArgsConstructor
@Slf4j
public class OutcomeCourseController {

  private final OutcomeRepo outcomeRepo;
  private final CourseRepo courseRepo;
  private final OutcomeCourseRepo outcomeCourseRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getOutcomeCourse(@PathVariable("programId") String programId,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "15") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<Outcome> outcomeList = outcomeRepo.findByProgramId(programId, 100, 0);
      List<Course> courseList = courseRepo.findByProgramId(programId, pageSize, offset);
      long total = courseRepo.countByProgramId(programId);
      List<OutcomeCourse> outcomeCourseList = outcomeCourseRepo.findByProgramId(programId, 100, 0);

      List<MatrixRow> matrixRowList = new ArrayList<>();
      for (Course course : courseList) {
        MatrixRow<OutcomeCourseCell> matrixRow = new MatrixRow<>();

        List<OutcomeCourseCell> outcomeCourseCellList = new ArrayList<>();
        for (Outcome outcome : outcomeList) {
          boolean result = Validator.checkOutcomeCourseMatrix(
              outcomeCourseList, outcome.getOutcomeName(), course.getId());
          OutcomeCourseCell outcomeCourseCell = new OutcomeCourseCell(outcome.getOutcomeName(), course.getId(), result);
          outcomeCourseCellList.add(outcomeCourseCell);
        }

        matrixRow.setTitle(course.getId());
        matrixRow.setData(outcomeCourseCellList);
        matrixRowList.add(matrixRow);
      }

      int lastPage = Utils.calculateLastPage(total, pageSize);
      List<String> outcomeNameList = outcomeList.stream().map(Outcome::getOutcomeName)
          .collect(Collectors.toCollection(LinkedList::new));
      outcomeNameList.add(0, Constant.OUTCOME_COURSE);

      MatrixResponse matrixResponse = new MatrixResponse(outcomeNameList, matrixRowList);
      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getOutcomeCourse SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getOutcomeCourse ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postOutcomeCourse(@PathVariable("programId") String programId,
      @RequestBody OutcomeCourseCell outcomeCourseCell) {
    BaseResponse response;
    try {
      OutcomeCourse outcomeCourse = new OutcomeCourse(programId, outcomeCourseCell);
      if (outcomeCourseCell.isCheck()) {
        jdbcAggregateTemplate.insert(outcomeCourse);
      } else {
        String sql = "DELETE FROM program_outcome_course WHERE program_id = ? AND outcome_name = ? AND course_id = ?";
        jdbcTemplate.update(sql, programId, outcomeCourseCell.getOutcomeName(), outcomeCourseCell.getCourseId());
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("postOutcomeCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postOutcomeCourse ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
