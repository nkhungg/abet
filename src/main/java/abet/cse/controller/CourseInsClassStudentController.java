package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.CourseInsClassStudent;
import abet.cse.model.CourseInsClassStudentExt;
import abet.cse.repository.CourseInsClassStudentRepo;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("course-instances/{courseInsId}/classes/{classId}/students")
@RequiredArgsConstructor
@Slf4j
public class CourseInsClassStudentController {

  private final CourseInsClassStudentRepo courseInsClassStudentRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInsClassStudentList(@PathVariable("courseInsId") String courseInsId,
      @PathVariable("classId") String classId,
      @RequestParam(value = "studentId", defaultValue = "") String studentId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "major", defaultValue = "") String major,
      @RequestParam(value = "year", defaultValue = "") String year,
      @RequestParam(value = "email", defaultValue = "") String email,
      @RequestParam(value = "sortBy", defaultValue = "student_id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM course_instance_class_student AS a LEFT JOIN student AS b"
          + " ON a.student_id = b.id WHERE a.class_id= ?"
          + " AND IFNULL(a.student_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.major, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.year, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.email, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<CourseInsClassStudentExt> studentList = jdbcTemplate.query(sql, CourseInsClassStudentExt.getRowMapper(),
          classId, studentId, name, major, year, email, pageSize, offset);
      long total = courseInsClassStudentRepo.count(classId, studentId, name, major, year, email);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, studentList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getCourseInsClassStudentList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseInsClassStudentList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postCourseInsClassStudentList(@PathVariable("courseInsId") String courseInsId,
      @PathVariable("classId") String classId, @RequestBody List<String> studentIdList) {
    BaseResponse response;
    try {
      for (String studentId : studentIdList) {
        CourseInsClassStudent courseInsClassStudent = new CourseInsClassStudent(courseInsId, classId, studentId);
        jdbcAggregateTemplate.insert(courseInsClassStudent);
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, studentIdList);
      log.info("postCourseInsClassStudentList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postCourseInsClassStudentList ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteCourseInsClassStudent(
      @PathVariable("classId") String classId, @PathVariable("id") String id) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM course_instance_class_student WHERE class_id = ? AND student_id = ?";
      jdbcTemplate.update(sql, classId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteCourseInsClassStudent SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteCourseInsClassStudent ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
