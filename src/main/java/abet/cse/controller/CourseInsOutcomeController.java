package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.CourseInsOutcome;
import abet.cse.model.ProgramIns;
import abet.cse.repository.CourseInsOutcomeRepo;
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
@RequestMapping("program-instances/{programInfo}/course-instances/{courseId}/outcomes")
@RequiredArgsConstructor
@Slf4j
public class CourseInsOutcomeController {

  private final CourseInsOutcomeRepo courseInsOutcomeRepo;
  private final ProgramInsRepo programInsRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseOutcomeInstanceList(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "cdio", defaultValue = "") String cdio,
      @RequestParam(value = "threshold", defaultValue = "") String threshold,
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
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      String programInsId = String.valueOf(programIns.getId());
      String sql = "SELECT * FROM course_outcome_instance WHERE IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(course_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(cdio, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(threshold, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(indicator_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(percent_indicator, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(parent_id, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<CourseInsOutcome> courseInsOutcomeList = jdbcTemplate.query(sql,
          CourseInsOutcome.getRowMapper(), name, description, programInsId, courseId, cdio, threshold,
          indicatorName, percentIndicator, parentId, pageSize, offset);
      long total = courseInsOutcomeRepo.count(name, description, programInsId, courseId, cdio,
          threshold, indicatorName, percentIndicator, parentId);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, courseInsOutcomeList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getCourseOutcomeInstanceList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseOutcomeInstanceList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postCourseOutcomeInstance(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId, @RequestBody CourseInsOutcome courseInsOutcome) {
    BaseResponse response;
    try {
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      CourseInsOutcome persistedCourseInsOutcome = courseInsOutcomeRepo
          .findByProgramInsIdAndCourseIdAndName(programIns.getId(), courseId, courseInsOutcome.getName());
      if (persistedCourseInsOutcome != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      courseInsOutcome.setProgramInstanceId(programIns.getId());
      jdbcAggregateTemplate.insert(courseInsOutcome);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsOutcome);
      log.info("postCourseOutcomeInstance SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseInsOutcome);
      log.error("postCourseOutcomeInstance FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postCourseOutcomeInstance ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putCourseInstanceOutcome(
      @PathVariable("id") Integer id, @RequestBody CourseInsOutcome courseInsOutcome) {
    BaseResponse response;
    try {
      boolean isExisted = courseInsOutcomeRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course_outcome_instance SET " + courseInsOutcome.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsOutcome);
      log.info("putCourseInstanceOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseInsOutcome);
      log.error("putCourseInstanceOutcome FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putCourseInstanceOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteCourseInstanceOutcome(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId, @PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      courseInsOutcomeRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteCourseInstanceOutcome SUCCESS with programInstanceId: {}, programInfo: {}", programInfo, id);
    } catch (Exception ex) {
      log.error("deleteCourseInstanceOutcome ERROR with programInstanceId: {}, programInfo: {}, exception: ", programInfo, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
