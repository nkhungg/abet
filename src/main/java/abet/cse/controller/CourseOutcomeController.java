package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.CourseOutcome;
import abet.cse.repository.CourseOutcomeRepo;
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
@RequestMapping("programs/{programId}/courses/{courseId}/outcomes")
@RequiredArgsConstructor
@Slf4j
public class CourseOutcomeController {

  private final CourseOutcomeRepo courseOutcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseOutcomeList(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "cdio", defaultValue = "") String cdio,
      @RequestParam(value = "indicatorName", defaultValue = "") String indicatorName,
      @RequestParam(value = "percentIndicator", defaultValue = "") String percentIndicator,
      @RequestParam(value = "parentId", defaultValue = "") String parentId,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM course_outcome WHERE IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(course_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(cdio, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(indicator_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(percent_indicator, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(parent_id, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<CourseOutcome> courseOutcomeList = jdbcTemplate.query(sql,
          CourseOutcome.getRowMapper(), name, description, programId, courseId, cdio, indicatorName,
          percentIndicator, parentId, pageSize, offset);
      long total = courseOutcomeRepo.count(name, description, programId, courseId, cdio,
          indicatorName, percentIndicator, parentId);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, courseOutcomeList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getCourseOutcomeList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseOutcomeList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postCourseOutcome(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId, CourseOutcome courseOutcome) {
    BaseResponse response;
    try {
      CourseOutcome persistedCourseOutcome = courseOutcomeRepo
          .findByProgramIdAndCourseIdAndName(programId, courseId, courseOutcome.getName());
      if (persistedCourseOutcome != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(courseOutcome);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseOutcome);
      log.info("postCourseOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseOutcome);
      log.error("postCourseOutcome FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postCourseOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putCourseOutcome(
      @PathVariable("id") Integer id, @RequestBody CourseOutcome courseOutcome) {
    BaseResponse response;
    try {
      boolean isExisted = courseOutcomeRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course_outcome SET " + courseOutcome.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseOutcome);
      log.info("putCourseOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseOutcome);
      log.error("putCourseOutcome FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putCourseOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteCourseOutcome(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId,
      @PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      courseOutcomeRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteCourseOutcome SUCCESS with programId: {}, id: {}", programId, id);
    } catch (Exception ex) {
      log.error("deleteCourseOutcome ERROR with programId: {}, id: {}, exception: ", programId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
