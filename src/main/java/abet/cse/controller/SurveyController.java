package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.ProgramIns;
import abet.cse.model.Survey;
import abet.cse.model.SurveyExt;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.repository.SurveyRepo;
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
@RequestMapping("program-instances/{programInfo}/surveys")
@RequiredArgsConstructor
@Slf4j
public class SurveyController {

  private final SurveyRepo surveyRepo;
  private final ProgramInsRepo programInsRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyList(@PathVariable("programInfo") String programInfo,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "surveyKindName", defaultValue = "") String surveyKindName,
      @RequestParam(value = "surveyTypeName", defaultValue = "") String surveyTypeName,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      Integer programInsId = Utils.getProgramInstanceId(programInsRepo, programInfo).getId();
      int offset = pageSize * (currentPage - 1);

      String sql = "SELECT a.*, b.name AS survey_type_name, CONCAT(c.program_id, '-', c.year, '-', c.semester) AS program_version_info FROM survey AS a LEFT JOIN survey_type AS b ON a.type = b.id"
          + " LEFT JOIN program_instance AS c ON a.program_instance_id = c.id WHERE a.program_instance_id = ?"
          + " AND IFNULL(a.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.survey_kind_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<SurveyExt> surveyExtList = jdbcTemplate.query(sql,
          SurveyExt.getRowMapper(), programInsId, name, description, surveyKindName, surveyTypeName, pageSize, offset);
      long total = surveyRepo.count(programInsId, name, description, surveyKindName, surveyTypeName);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, surveyExtList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSurveyList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSurveyList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postSurvey(@PathVariable("programInfo") String programInfo,
      @RequestBody Survey survey) {
    BaseResponse response;
    try {
      Boolean isExisted = surveyRepo.existsById(survey.getName());
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      survey.setField(programInfo, programIns.getId());
      jdbcAggregateTemplate.insert(survey);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, survey);
      log.info("postSurvey SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), survey);
      log.error("postSurvey FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postSurvey ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurvey(@PathVariable("programInfo") String programInfo,
      @PathVariable("name") String name, @RequestBody Survey survey) {
    BaseResponse response;
    try {
      boolean isExisted = surveyRepo.existsById(name);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE survey SET " + survey.toSql() + ", `lock` = " + (survey.getLock() ? 1 : 0) + " WHERE name = ?";
      jdbcTemplate.update(sql, name);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, survey);
      log.info("putSurvey SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), survey);
      log.error("putSurvey FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putSurvey ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurvey(@PathVariable("programInfo") String programInfo,
      @PathVariable("name") String name) {
    BaseResponse response;
    try {
      surveyRepo.deleteById(name);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteSurvey SUCCESS with programInfo: {}, name: {}", programInfo, name);
    } catch (Exception ex) {
      log.error("deleteSurvey ERROR with programInfo: {}, name: {}", programInfo, name, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
