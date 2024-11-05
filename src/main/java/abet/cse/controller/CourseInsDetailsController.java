package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.CourseInsDetails;
import abet.cse.model.CourseInsDetailsOutcome;
import abet.cse.model.ProgramIns;
import abet.cse.repository.CourseInsDetailsOutcomeRepo;
import abet.cse.repository.CourseInsDetailsRepo;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/course-instances/{courseId}/details")
@RequiredArgsConstructor
@Slf4j
public class CourseInsDetailsController {

  private final ProgramInsRepo programInsRepo;
  private final CourseInsDetailsRepo courseInsDetailsRepo;
  private final CourseInsDetailsOutcomeRepo courseInsDetailsOutcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInsDetailsList(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId,
      @RequestParam(value = "type", defaultValue = "1") Integer type) {
    BaseResponse response;
    try {
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      List<CourseInsDetails> courseInsDetailsList = courseInsDetailsRepo
          .findByProgramInsIdAndCourseIdAndType(programIns.getId(), courseId, type);

      for (CourseInsDetails courseInsDetails : courseInsDetailsList) {
        List<Integer> outcomeIdList = courseInsDetailsOutcomeRepo
            .findOutcomeIdByCourseDetailsId(courseInsDetails.getId());
        courseInsDetails.setOutcomeIdList(outcomeIdList);
      }

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsDetailsList);
      log.info("getCourseInsDetailsList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseInsDetailsList ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postCourseInsDetails(@PathVariable("programInfo") String programInfo,
      @RequestBody CourseInsDetails courseInsDetails) {
    BaseResponse response;
    try {
      CourseInsDetails newCourseInsDetails = courseInsDetailsRepo.save(courseInsDetails);
      for (Integer outcomeId : courseInsDetails.getOutcomeIdList()) {
        jdbcAggregateTemplate.insert(new CourseInsDetailsOutcome(newCourseInsDetails.getId(), outcomeId));
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsDetails);
      log.info("postCourseInsDetails SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postCourseInsDetails ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putCourseInsDetails(@PathVariable("programInfo") String programInfo,
      @PathVariable("id") Integer id, @RequestBody CourseInsDetails courseInsDetails) {
    BaseResponse response;
    try {
      boolean isExisted = courseInsDetailsRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course_instance_ndct SET " + courseInsDetails.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      courseInsDetailsOutcomeRepo.deleteById(id);
      for (Integer outcomeId : courseInsDetails.getOutcomeIdList()) {
        jdbcAggregateTemplate.insert(new CourseInsDetailsOutcome(id, outcomeId));
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsDetails);
      log.info("putCourseInsDetails SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseInsDetails);
      log.error("putCourseInsDetails FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putCourseInsDetails ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteCourseInsDetails(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId, @PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      courseInsDetailsRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteCourseInsDetails SUCCESS with programInfo: {}, courseId: {}, id: {}", programInfo, courseId, id);
    } catch (Exception ex) {
      log.error("deleteCourseInsDetails ERROR with programInfo: {}, courseId: {}, id: {}, exception: ", programInfo, courseId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
