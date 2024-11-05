package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Indicator;
import abet.cse.model.Outcome;
import abet.cse.repository.IndicatorRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import abet.cse.validator.Validator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("programs/{programId}/outcomes/{outcomeName}/indicators")
@RequiredArgsConstructor
@Slf4j
public class IndicatorController {

  private final IndicatorRepo indicatorRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getIndicatorList(@PathVariable("programId") String programId,
      @PathVariable("outcomeName") String outcomeName,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "cdio", defaultValue = "") String cdio,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT a.*, GROUP_CONCAT(CONCAT(b.level_id, '_', IFNULL(b.description, '')) SEPARATOR '|')"
          + " AS level_str FROM performance_indicator AS a LEFT JOIN indicator_level AS b"
          + " ON a.name = b.indicator_name and a.program_id = b.program_id"
          + " WHERE IFNULL(a.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.outcome_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.cdio, '') LIKE CONCAT('%',?,'%') GROUP BY a.name"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Indicator> indicatorList = jdbcTemplate.query(sql,
          Indicator.getRowMapper(), name, description, outcomeName, programId, cdio, pageSize, offset);
      long total = indicatorRepo.count(name, description, outcomeName, programId, cdio);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, indicatorList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getIndicatorList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getIndicatorList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postIndicator(@PathVariable("programId") String programId,
      @PathVariable("outcomeName") String outcomeName, Indicator indicator,
      String[] levelIdList, String[] descriptionList) {
    BaseResponse response;
    try {
      if (levelIdList == null) levelIdList = new String[0];
      if (descriptionList == null) descriptionList = new String[0];
      boolean isValid = Validator.validateAttr(levelIdList, descriptionList);
      if (!isValid) throw new AbetCseException(AbetCseStatusEnum.INVALID_LIST);

      Outcome persistedOutcome = indicatorRepo.findByProgramIdAndOutcomeNameAndName(
          programId, outcomeName, indicator.getName());
      if (persistedOutcome != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      for (int i = 0; i < levelIdList.length; i++) {
        indicator.addIndicatorLevel(levelIdList[i], descriptionList[i]);
      }
      jdbcAggregateTemplate.insert(indicator);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, indicator);
      log.info("postIndicator SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), indicator);
      log.error("postIndicator FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postIndicator ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @Transactional
  @PutMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putIndicator(@PathVariable("programId") String programId,
      @PathVariable("outcomeName") String outcomeName,
      @PathVariable("name") String name, Indicator indicator,
      String[] levelIdList, String[] descriptionList) {
    BaseResponse response;
    try {
      if (levelIdList == null) levelIdList = new String[0];
      if (descriptionList == null) descriptionList = new String[0];
      boolean isValid = Validator.validateAttr(levelIdList, descriptionList);
      if (!isValid) throw new AbetCseException(AbetCseStatusEnum.INVALID_LIST);

      Outcome persistedOutcome = indicatorRepo.findByProgramIdAndOutcomeNameAndName(programId, outcomeName, name);
      if (persistedOutcome == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      for (int i = 0; i < levelIdList.length; i++) {
        indicator.addIndicatorLevel(levelIdList[i], descriptionList[i]);
      }
      deleteIndicator(indicator.getProgramId(), indicator.getOutcomeName(), indicator.getName());
      jdbcAggregateTemplate.insert(indicator);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, indicator);
      log.info("putIndicator SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), indicator);
      log.error("putIndicator FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putIndicator ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteIndicator(@PathVariable("programId") String programId,
      @PathVariable("outcomeName") String outcomeName,
      @PathVariable("name") String name) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM performance_indicator WHERE program_id = ? AND outcome_name = ? AND name = ?";
      jdbcTemplate.update(sql, programId, outcomeName, name);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteIndicator SUCCESS with programId: {}, name: {}", programId, name);
    } catch (Exception ex) {
      log.error("deleteIndicator ERROR with programId: {}, id: {}, exception: ", programId, name, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
