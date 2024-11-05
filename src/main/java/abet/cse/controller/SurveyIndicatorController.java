package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.SurveyAdditionQuestionLevel;
import abet.cse.model.SurveyIndicator;
import abet.cse.model.SurveyIndicatorExt;
import abet.cse.repository.SurveyAdditionQuestionLevelRepo;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.ArrayList;
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
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/questions")
@RequiredArgsConstructor
@Slf4j
public class SurveyIndicatorController {

  private final SurveyIndicatorRepo surveyIndicatorRepo;
  private final SurveyAdditionQuestionLevelRepo surveyAdditionQuestionLevelRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyQuestionList(@PathVariable("surveyName") String surveyName,
      @RequestParam(value = "indicatorName", defaultValue = "") String indicatorName,
      @RequestParam(value = "maxGrade", defaultValue = "") String maxGrade,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "priority", defaultValue = "") String priority,
      @RequestParam(value = "outcome", defaultValue = "") String outcome,
      @RequestParam(value = "additionalQuestion", defaultValue = "") String additionalQuestion,
      @RequestParam(value = "sortBy", defaultValue = "priority") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT a.*, GROUP_CONCAT(IFNULL(b.description, '') SEPARATOR '|') AS option_str,"
          + " GROUP_CONCAT(CONCAT(IFNULL(c.level_id, ''), '_', IFNULL(c.description, ''), '_', IFNULL(c.min_grade, ''), '_', IFNULL(c.max_grade, ''), '_', IFNULL(c.min_grade_flag, ''), '_', IFNULL(c.max_grade_flag, '')) SEPARATOR '|')"
          + " AS answer_str FROM survey_indicator AS a"
          + " LEFT JOIN survey_addition_question_level AS b ON a.id = b.survey_indicator_id"
          + " LEFT JOIN survey_indicator_level AS c ON a.id = c.survey_indicator_id WHERE survey_name = ?"
          + " AND IFNULL(a.indicator_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.max_grade, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.priority, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.outcome, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.additional_question, '') LIKE CONCAT('%',?,'%') GROUP BY a.id"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<SurveyIndicatorExt> questionList = jdbcTemplate.query(sql,
          SurveyIndicatorExt.getRowMapper(), surveyName, indicatorName, maxGrade, description,
          priority, outcome, additionalQuestion, pageSize, offset);
      long total = surveyIndicatorRepo.count(surveyName, indicatorName,
          maxGrade, description, priority, outcome, additionalQuestion);
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
  public ResponseEntity postSurveyQuestion(@PathVariable("programInfo") String programInfo,
      @PathVariable("surveyName") String surveyName,
      @RequestBody SurveyIndicatorExt surveyIndicatorExt) {
    BaseResponse response;
    try {
      surveyIndicatorExt.setField(programInfo.split(Constant.HYPHEN)[0], surveyName);
      SurveyIndicator surveyIndicator = new SurveyIndicator(surveyIndicatorExt);
      SurveyIndicator newSurveyIndicator = jdbcAggregateTemplate.insert(surveyIndicator);
      List<SurveyAdditionQuestionLevel> levelList = new ArrayList<>();
      String[] optionArray = surveyIndicatorExt.getOptionSet();
      for (int i = 0; i < optionArray.length; i++) {
        levelList.add(new SurveyAdditionQuestionLevel(newSurveyIndicator.getId(), optionArray[i]));
      }
      surveyAdditionQuestionLevelRepo.saveAll(levelList);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, surveyIndicatorExt);
      log.info("postSurveyQuestion SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postSurveyQuestion ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyQuestion(@PathVariable("surveyName") String surveyName,
      @PathVariable("id") Integer id, @RequestBody SurveyIndicatorExt surveyIndicatorExt) {
    BaseResponse response;
    try {
      boolean isExisted = surveyIndicatorRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE survey_indicator SET " + surveyIndicatorExt.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);

      String deleteSql = "DELETE FROM survey_addition_question_level WHERE survey_indicator_id = ?";
      jdbcTemplate.update(deleteSql, id);

      List<SurveyAdditionQuestionLevel> levelList = new ArrayList<>();
      String[] optionArray = surveyIndicatorExt.getOptionSet();
      for (int i = 0; i < optionArray.length; i++) {
        levelList.add(new SurveyAdditionQuestionLevel(id, optionArray[i]));
      }
      surveyAdditionQuestionLevelRepo.saveAll(levelList);

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, surveyIndicatorExt);
      log.info("putSurveyQuestion SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), surveyIndicatorExt);
      log.error("putSurveyQuestion FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putSurveyQuestion ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyQuestion(@PathVariable("surveyName") String surveyName,
      @PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      surveyIndicatorRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteSurveyQuestion SUCCESS with surveyName: {}, id: {}", surveyName, id);
    } catch (Exception ex) {
      log.error("deleteSurveyQuestion ERROR with surveyName: {}, id: {}", surveyName, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
