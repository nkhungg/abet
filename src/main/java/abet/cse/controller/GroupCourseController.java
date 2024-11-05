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
@RequestMapping("programs/{programId}/groups/{groupId}/courses")
@RequiredArgsConstructor
@Slf4j
public class GroupCourseController {

  private final CourseRepo courseRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getGroupCourseList(@PathVariable("programId") String programId,
      @PathVariable("groupId") String groupId,
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
          + " AND IFNULL(group_id, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Course> courseList = jdbcTemplate.query(sql,
          Course.getRowMapper(), name, id, programId, groupId, pageSize, offset);
      long total = courseRepo.count(name, id, programId, groupId, "");
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, courseList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getGroupCourseList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getGroupCourseList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postGroupCourse(@PathVariable("programId") String programId,
      @PathVariable("groupId") int groupId, Course course) {
    BaseResponse response;
    try {
      Course persistedCourse = courseRepo.findByProgramIdAndId(programId, course.getId());
      if (persistedCourse != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(course);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, course);
      log.info("postGroupCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), course);
      log.error("postGroupCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postGroupCourse ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putGroupCourse(@PathVariable("programId") String programId,
      @PathVariable("groupId") int groupId, @PathVariable("id") String id, Course course) {
    BaseResponse response;
    try {
      Course persistedCourse = courseRepo.findByProgramIdAndId(programId, id);
      if (persistedCourse == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course SET name = ?, credit = ?, semester_id = ? WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, course.getName(), course.getCredit(), course.getSemesterId(),
          course.getProgramId(), course.getId());
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, course);
      log.info("putGroupCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), course);
      log.error("putGroupCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putGroupCourse ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteGroupCourse(@PathVariable("programId") String programId,
      @PathVariable("groupId") int groupId, @PathVariable("id") String id) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM course WHERE program_id = ? AND group_id = ? AND id = ?";
      jdbcTemplate.update(sql, programId, groupId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteGroupCourse SUCCESS with programId: {}, id: {}", programId, id);
    } catch (Exception ex) {
      log.error("deleteGroupCourse ERROR with programId: {}, id: {}, exception: ", programId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
