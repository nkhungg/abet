package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.Course;
import abet.cse.model.CourseOutline;
import abet.cse.repository.CourseOutlineRepo;
import abet.cse.repository.ParallelCourseRepo;
import abet.cse.repository.PrerequisiteCourseRepo;
import abet.cse.repository.PriorCourseRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
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
@RequestMapping("programs/{programId}/courses/{courseId}/outline")
@RequiredArgsConstructor
@Slf4j
public class CourseOutlineController {

  private final CourseOutlineRepo courseOutlineRepo;
  private final ParallelCourseRepo parallelCourseRepo;
  private final PrerequisiteCourseRepo prerequisiteCourseRepo;
  private final PriorCourseRepo priorCourseRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseOutline(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId) {
    BaseResponse response;
    try {
      CourseOutline courseOutline = courseOutlineRepo.findByProgramIdAndId(programId, courseId);
      List<String> parallelCourseIdList = parallelCourseRepo.findByProgramIdAndCourseId(programId, courseId);
      List<String> prerequisiteCourseIdList = prerequisiteCourseRepo.findByProgramIdAndCourseId(programId, courseId);
      List<String> priorCourseIdList = priorCourseRepo.findByProgramIdAndCourseId(programId, courseId);
      courseOutline.addCourseIdList(parallelCourseIdList, prerequisiteCourseIdList, priorCourseIdList);

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseOutline);
      log.info("getCourseOutline SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseOutline ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putCourseOutline(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId, @RequestBody CourseOutline courseOutline) {
    BaseResponse response;
    try {
      Course persistedCourse = courseOutlineRepo.findByProgramIdAndId(programId, courseId);
      if (persistedCourse == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course SET " + courseOutline.toSql() + " WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, programId, courseId);
      updateCourseIdList(Constant.PARALLEL_COURSE, programId, courseId, courseOutline.getParallelCourseIdList());
      updateCourseIdList(Constant.PREREQUISITE_COURSE, programId, courseId, courseOutline.getPrerequisiteCourseIdList());
      updateCourseIdList(Constant.PRIOR_COURSE, programId, courseId, courseOutline.getPriorCourseIdList());
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseOutline);
      log.info("putGroupCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseOutline);
      log.error("putGroupCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putGroupCourse ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  public void updateCourseIdList(String tableName, String programId, String courseId, List<String> idList) {
    String deleteSql = "DELETE FROM " + tableName + " WHERE program_id = ? AND Id_mon = ?";
    jdbcTemplate.update(deleteSql, programId, courseId);
    String sqlValue = "";
    if (idList.size() > 0) sqlValue += Utils.toInsertSqlValue(idList.get(0), courseId, programId);
    for (int i = 1; i < idList.size(); i++) {
      sqlValue += (", " + Utils.toInsertSqlValue(idList.get(i), courseId, programId));
    }
    if (StringUtils.isBlank(sqlValue)) return;
    String insertSql = "INSERT INTO " + tableName + " VALUES " + sqlValue;
    jdbcTemplate.update(insertSql);
  }
}
