package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.CourseIns;
import abet.cse.model.CourseInsOutline;
import abet.cse.model.ProgramIns;
import abet.cse.repository.CourseInsOutlineRepo;
import abet.cse.repository.ParallelCourseRepo;
import abet.cse.repository.PrerequisiteCourseRepo;
import abet.cse.repository.PriorCourseRepo;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/course-instances/{courseId}/outline")
@RequiredArgsConstructor
@Slf4j
public class CourseInsOutlineController {

  private final ProgramInsRepo programInsRepo;
  private final CourseInsOutlineRepo courseInsOutlineRepo;
  private final ParallelCourseRepo parallelCourseRepo;
  private final PrerequisiteCourseRepo prerequisiteCourseRepo;
  private final PriorCourseRepo priorCourseRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInsOutline(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId) {
    BaseResponse response;
    try {
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      String programId = programIns.getProgramId();
      CourseInsOutline courseInsOutline = courseInsOutlineRepo.findByProgramIdAndId(programIns.getId(), courseId);
      List<String> parallelCourseIdList = parallelCourseRepo.findByProgramIdAndCourseId(programId, courseId);
      List<String> prerequisiteCourseIdList = prerequisiteCourseRepo.findByProgramIdAndCourseId(programId, courseId);
      List<String> priorCourseIdList = priorCourseRepo.findByProgramIdAndCourseId(programId, courseId);
      courseInsOutline.addCourseIdList(parallelCourseIdList, prerequisiteCourseIdList, priorCourseIdList);

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsOutline);
      log.info("getCourseInsOutline SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseOutline ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putCourseInsOutline(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId, @RequestBody CourseInsOutline courseInsOutline) {
    BaseResponse response;
    try {
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      CourseIns persistedCourseIns = courseInsOutlineRepo.findByProgramIdAndId(programIns.getId(), courseId);
      if (persistedCourseIns == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course_instance SET " + courseInsOutline.toSql() + " WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, programIns.getId(), courseId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsOutline);
      log.info("putCourseInsOutline SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseInsOutline);
      log.error("putGroupCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putCourseInsOutline ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
