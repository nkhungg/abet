package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.TestCourseOutcome;
import abet.cse.model.TestCourseOutcomeExt;
import abet.cse.repository.TestCourseOutcomeRepo;
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
@RequestMapping("tests/{testId}/outcomes")
@RequiredArgsConstructor
@Slf4j
public class TestCourseOutcomeController {

  private final TestCourseOutcomeRepo testCourseOutcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getTestCourseOutcomeList(@PathVariable("testId") String testId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "percent", defaultValue = "") String percent,
      @RequestParam(value = "comment", defaultValue = "") String comment,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT a.*, b.name, b.description FROM test_course_outcome AS a LEFT JOIN"
          + " course_outcome_instance AS b ON a.course_outcome_id = b.id WHERE test_id = ? "
          + " AND IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(percent, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.comment, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<TestCourseOutcomeExt> testCourseOutcomeExtList = jdbcTemplate.query(sql,
          TestCourseOutcomeExt.getRowMapper(), testId, name, description, percent, comment, pageSize, offset);
      long total = testCourseOutcomeRepo.count(testId, name, description, percent, comment);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, testCourseOutcomeExtList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getTestCourseOutcomeList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getTestCourseOutcomeList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postTestCourseOutcome(@PathVariable("testId") String testId,
      @RequestBody TestCourseOutcome testCourseOutcome) {
    BaseResponse response;
    try {
      testCourseOutcome.setTestId(testId);
      jdbcAggregateTemplate.insert(testCourseOutcome);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, testCourseOutcome);
      log.info("postTestCourseOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postTestCourseOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putTestCourseOutcome(@PathVariable("testId") String testId,
      @PathVariable("id") Integer id, @RequestBody TestCourseOutcome testCourseOutcome) {
    BaseResponse response;
    try {
      boolean isExisted = testCourseOutcomeRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE test_course_outcome SET " + testCourseOutcome.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, testCourseOutcome);
      log.info("putTestCourseOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), testCourseOutcome);
      log.error("putTestCourseOutcome FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putTestCourseOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteTestCourseOutcome(@PathVariable("testId") String testId,
      @PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      testCourseOutcomeRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteTestCourseOutcome SUCCESS with testId: {}, id: {}", testId, id);
    } catch (Exception ex) {
      log.error("deleteTestCourseOutcome ERROR with testId: {}, id: {}", testId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
