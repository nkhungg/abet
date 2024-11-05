package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.CourseDetails;
import abet.cse.model.CourseDetailsOutcome;
import abet.cse.repository.CourseDetailsOutcomeRepo;
import abet.cse.repository.CourseDetailsRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
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
@RequestMapping("programs/{programId}/courses/{courseId}/details")
@RequiredArgsConstructor
@Slf4j
public class CourseDetailsController {

  private final CourseDetailsRepo courseDetailsRepo;
  private final CourseDetailsOutcomeRepo courseDetailsOutcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseDetailsList(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId,
      @RequestParam(value = "type", defaultValue = "1") Integer type) {
    BaseResponse response;
    try {
      List<CourseDetails> courseDetailsList = courseDetailsRepo
          .findByProgramIdAndCourseIdAndType(programId, courseId, type);

      for (CourseDetails courseDetails : courseDetailsList) {
        List<Integer> outcomeIdList = courseDetailsOutcomeRepo
            .findOutcomeIdByCourseDetailsId(courseDetails.getId());
        courseDetails.setOutcomeIdList(outcomeIdList);
      }

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseDetailsList);
      log.info("getCourseDetailsList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseDetailsList ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postCourseDetails(@RequestBody CourseDetails courseDetails) {
    BaseResponse response;
    try {
      CourseDetails newCourseDetails = courseDetailsRepo.save(courseDetails);
      for (Integer outcomeId : courseDetails.getOutcomeIdList()) {
        jdbcAggregateTemplate.insert(new CourseDetailsOutcome(newCourseDetails.getId(), outcomeId));
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseDetails);
      log.info("postCourseDetails SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postCourseDetails ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putCourseDetails(
      @PathVariable("id") Integer id, @RequestBody CourseDetails courseDetails) {
    BaseResponse response;
    try {
      boolean isExisted = courseDetailsRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course_ndct SET " + courseDetails.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      courseDetailsOutcomeRepo.deleteById(id);
      for (Integer outcomeId : courseDetails.getOutcomeIdList()) {
        jdbcAggregateTemplate.insert(new CourseDetailsOutcome(id, outcomeId));
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseDetails);
      log.info("putCourseDetails SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseDetails);
      log.error("putCourseDetails FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putCourseDetails ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteCourseDetails(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId, @PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      courseDetailsRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteCourseDetails SUCCESS with programId: {}, courseId: {}, id: {}", programId, courseId, id);
    } catch (Exception ex) {
      log.error("deleteCourseDetails ERROR with programId: {}, courseId: {}, id: {}, exception: ", programId, courseId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
