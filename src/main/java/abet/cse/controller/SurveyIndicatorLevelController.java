package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.SurveyIndicatorLevel;
import abet.cse.repository.SurveyIndicatorLevelRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/questions/{questionId}/answers")
@RequiredArgsConstructor
@Slf4j
public class SurveyIndicatorLevelController {

  private final SurveyIndicatorLevelRepo surveyIndicatorLevelRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyAnswer(@PathVariable("questionId") Integer questionId) {
    BaseResponse response;
    try {
      List<SurveyIndicatorLevel> answerList = surveyIndicatorLevelRepo.find(questionId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, answerList);
      log.info("getSurveyAnswer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSurveyAnswer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postSurveyAnswer(@PathVariable("questionId") Integer questionId,
      @RequestBody SurveyIndicatorLevel surveyIndicatorLevel) {
    BaseResponse response;
    try {
      Integer counter = surveyIndicatorLevelRepo.find(questionId, surveyIndicatorLevel.getLevelId());
      if (counter != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      surveyIndicatorLevel.setSurveyIndicatorId(questionId);
      jdbcAggregateTemplate.insert(surveyIndicatorLevel);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, surveyIndicatorLevel);
      log.info("postSurveyAnswer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postSurveyAnswer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyAnswer(@PathVariable("questionId") Integer questionId,
      @PathVariable("id") String id, @RequestBody SurveyIndicatorLevel surveyIndicatorLevel) {
    BaseResponse response;
    try {
      Integer counter = surveyIndicatorLevelRepo.find(questionId, id);
      if (counter == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE survey_indicator_level SET " + surveyIndicatorLevel.toSql()
          + " WHERE survey_indicator_id = ? AND level_id = ?";
      jdbcTemplate.update(sql, questionId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, surveyIndicatorLevel);
      log.info("putSurveyAnswer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), surveyIndicatorLevel);
      log.error("putSurveyAnswer FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putSurveyAnswer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyAnswer(@PathVariable("questionId") Integer questionId,
      @PathVariable("id") String id) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM survey_indicator_level WHERE survey_indicator_id = ? AND level_id = ?";
      jdbcTemplate.update(sql, questionId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteSurveyAnswer SUCCESS with questionId: {}, id: {}", questionId, id);
    } catch (Exception ex) {
      log.error("deleteSurveyAnswer ERROR with questionId: {}, id: {}", questionId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
