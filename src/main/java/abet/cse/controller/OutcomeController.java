package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Outcome;
import abet.cse.repository.OutcomeRepo;
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
@RequestMapping("programs/{programId}/outcomes")
@RequiredArgsConstructor
@Slf4j
public class OutcomeController {

  private final OutcomeRepo outcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getOutcomeList(@PathVariable("programId") String programId,
      @RequestParam(value = "outcomeName", defaultValue = "") String outcomeName,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "cdio", defaultValue = "") String cdio,
      @RequestParam(value = "sortBy", defaultValue = "outcome_name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM program_outcome WHERE IFNULL(outcome_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(cdio, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Outcome> outcomeList = jdbcTemplate.query(sql,
          Outcome.getRowMapper(), outcomeName, programId, description, cdio, pageSize, offset);
      long total = outcomeRepo.count(outcomeName, programId, description, cdio);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, outcomeList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getOutcomeList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getOutcomeList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postOutcome(@PathVariable("programId") String programId, Outcome outcome) {
    BaseResponse response;
    try {
      Outcome persistedOutcome = outcomeRepo.findByProgramIdAndName(programId, outcome.getOutcomeName());
      if (persistedOutcome != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(outcome);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, outcome);
      log.info("postOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), outcome);
      log.error("postOutcome FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putOutcome(@PathVariable("programId") String programId,
      @PathVariable("name") String name, Outcome outcome) {
    BaseResponse response;
    try {
      Outcome persistedOutcome = outcomeRepo.findByProgramIdAndName(programId, name);
      if (persistedOutcome == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      outcomeRepo.save(outcome);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, outcome);
      log.info("putOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), outcome);
      log.error("putOutcome FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putOutcome ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteOutcome(@PathVariable("programId") String programId,
      @PathVariable("name") String name) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM program_outcome WHERE program_id = ? AND outcome_name = ?";
      jdbcTemplate.update(sql, programId, name);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteOutcome SUCCESS with programId: {}, name: {}", programId, name);
    } catch (Exception ex) {
      log.error("deleteOutcome ERROR with programId: {}, id: {}, exception: ", programId, name, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
