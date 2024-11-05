package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Course;
import abet.cse.repository.CourseRepo;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("programs/{programId}/semesters/{semesterId}/courses")
@RequiredArgsConstructor
@Slf4j
public class SemesterCourseController {

  private final CourseRepo courseRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSemesterCourseList(@PathVariable("programId") String programId,
      @PathVariable("semesterId") String semesterId,
      @RequestParam(value = "id", defaultValue = "") String id,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM course WHERE IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(semester_id, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Course> courseList = jdbcTemplate.query(sql,
          Course.getRowMapper(), name, id, programId, semesterId, pageSize, offset);
      long total = courseRepo.count(name, id, programId, "", semesterId);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, courseList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSemesterCourseList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSemesterCourseList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postSemesterCourse(@PathVariable("programId") String programId,
      @PathVariable("semesterId") int semesterId, Course course) {
    BaseResponse response;
    try {
      Course persistedCourse = courseRepo.findByProgramIdAndId(programId, course.getId());
      if (persistedCourse != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(course);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, course);
      log.info("postSemesterCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), course);
      log.error("postSemesterCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postSemesterCourse ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSemesterCourse(@PathVariable("programId") String programId,
      @PathVariable("semesterId") int semesterId, @PathVariable("id") String id, Course course) {
    BaseResponse response;
    try {
      Course persistedCourse = courseRepo.findByProgramIdAndId(programId, id);
      if (persistedCourse == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course SET name = ?, credit = ?, group_id = ? WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, course.getName(), course.getCredit(), course.getGroupId(),
          course.getProgramId(), course.getId());
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, course);
      log.info("putSemesterCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), course);
      log.error("putSemesterCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putSemesterCourse ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSemesterCourse(@PathVariable("programId") String programId,
      @PathVariable("semesterId") int semesterId, @PathVariable("id") String id) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM course WHERE program_id = ? AND semester_id = ? AND id = ?";
      jdbcTemplate.update(sql, programId, semesterId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteSemesterCourse SUCCESS with programId: {}, id: {}", programId, id);
    } catch (Exception ex) {
      log.error("deleteSemesterCourse ERROR with programId: {}, id: {}, exception: ", programId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
