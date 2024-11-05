package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.QuestionCourseOutcome;
import abet.cse.repository.QuestionCourseOutcomeRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.data.relational.core.conversion.DbActionExecutionException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("questions/{questionId}/outcomes")
@RequiredArgsConstructor
@Slf4j
public class QuestionCourseOutcomeController {

  private final QuestionCourseOutcomeRepo questionCourseOutcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postQuestionCourseOutcome(@PathVariable("questionId") String questionId,
      @RequestBody QuestionCourseOutcome questionCourseOutcome) {
    BaseResponse response;
    try {
      questionCourseOutcome.setQuestionId(questionId);
      jdbcAggregateTemplate.insert(questionCourseOutcome);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, questionCourseOutcome);
      log.info("postQuestionCourseOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (DbActionExecutionException ex) {
      log.error("getTestCourseOutcomeList ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.QUESTION_COURSE_OUTCOME_EXISTED);
    }  catch (Exception ex) {
      log.error("postQuestionCourseOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putQuestionCourseOutcome(@PathVariable("questionId") String questionId,
      @PathVariable("id") Integer id, @RequestBody QuestionCourseOutcome questionCourseOutcome) {
    BaseResponse response;
    try {
      boolean isExisted = questionCourseOutcomeRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE question_course_outcome SET " + questionCourseOutcome.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, questionCourseOutcome);
      log.info("putQuestionCourseOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), questionCourseOutcome);
      log.error("putQuestionCourseOutcome FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putQuestionCourseOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteQuestionCourseOutcome(@PathVariable("questionId") String questionId,
      @PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      questionCourseOutcomeRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteQuestionCourseOutcome SUCCESS with questionId: {}, id: {}", questionId, id);
    } catch (Exception ex) {
      log.error("deleteQuestionCourseOutcome ERROR with questionId: {}, id: {}", questionId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
