package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Question;
import abet.cse.repository.QuestionRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
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
@RequestMapping("tests/{testId}/questions")
@RequiredArgsConstructor
@Slf4j
public class QuestionController {

  private final QuestionRepo questionRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getQuestionList(@PathVariable("testId") String testId,
      @RequestParam(value = "classId", defaultValue = "") String classId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "content", defaultValue = "") String content,
      @RequestParam(value = "percent", defaultValue = "") String percent,
      @RequestParam(value = "attachFile", defaultValue = "") String attachFile,
      @RequestParam(value = "maxScore", defaultValue = "") String maxScore,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<Question> questionList;
      long total;

      if (StringUtils.isBlank(classId)) {
        String sql = "SELECT a.*, GROUP_CONCAT(CONCAT(b.id, '_', IFNULL(b.course_outcome_id, ''), '_',"
            + " IFNULL(b.course_outcome_name, ''), '_', IFNULL(b.comment, ''), '_', IFNULL(b.percent, '')) SEPARATOR '|')"
            + " AS outcome_str FROM question AS a LEFT JOIN question_course_outcome AS b ON a.id = b.question_id"
            + " WHERE a.test_id = ? AND a.class_id IS NULL"
            + " AND IFNULL(a.name, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.content, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.percent, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.attach_file, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.max_score, '') LIKE CONCAT('%',?,'%') GROUP BY a.id"
            + Utils.getOrderPagingSql(sortBy, orderBy);
        questionList = jdbcTemplate.query(sql,
            Question.getRowMapper(), testId, name, content, percent, attachFile, maxScore, pageSize, offset);
        total = questionRepo.count(testId, name, content, percent, attachFile, maxScore);
      } else {
        String sql = "SELECT a.*, GROUP_CONCAT(CONCAT(b.id, '_', IFNULL(b.course_outcome_id, ''), '_',"
            + " IFNULL(b.course_outcome_name, ''), '_', IFNULL(b.comment, ''), '_', IFNULL(b.percent, '')) SEPARATOR '|')"
            + " AS outcome_str FROM question AS a LEFT JOIN question_course_outcome AS b ON a.id = b.question_id"
            + " WHERE a.test_id = ? AND (a.class_id = ? OR a.class_id IS NULL)"
            + " AND IFNULL(a.name, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.content, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.percent, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.attach_file, '') LIKE CONCAT('%',?,'%')"
            + " AND IFNULL(a.max_score, '') LIKE CONCAT('%',?,'%') GROUP BY a.id"
            + Utils.getOrderPagingSql(sortBy, orderBy);
        questionList = jdbcTemplate.query(sql,
            Question.getRowMapper(), testId, classId, name, content, percent, attachFile, maxScore, pageSize, offset);
        total = questionRepo.count(testId, classId, name, content, percent, attachFile, maxScore);
      }
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, questionList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getQuestionList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getQuestionList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postQuestion(@PathVariable("testId") String testId,
      @RequestBody Question question) {
    BaseResponse response;
    try {
      question.setField(testId);
      boolean isExisted = questionRepo.existsById(question.getId());
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(question);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, question);
      log.info("postQuestion SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), question);
      log.error("postQuestion FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postQuestion ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putQuestion(@PathVariable("testId") String testId,
      @PathVariable("id") String id, @RequestBody Question question) {
    BaseResponse response;
    try {
      boolean isExisted = questionRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE question SET " + question.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, question);
      log.info("putQuestion SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), question);
      log.error("putQuestion FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putQuestion ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteQuestion(@PathVariable("testId") String testId,
      @PathVariable("id") String id) {
    BaseResponse response;
    try {
      questionRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteQuestion SUCCESS with testId: {}, id: {}", testId, id);
    } catch (Exception ex) {
      log.error("deleteQuestion ERROR with testId: {}, id: {}", testId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
