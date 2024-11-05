package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Peo;
import abet.cse.repository.PeoRepo;
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
@RequestMapping("programs/{programId}/peos")
@RequiredArgsConstructor
@Slf4j
public class PeoController {

  private final PeoRepo peoRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getPeoList(@PathVariable("programId") String programId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "priority", defaultValue = "") String priority,
      @RequestParam(value = "sortBy", defaultValue = "priority") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM peo WHERE IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(priority, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Peo> peoList = jdbcTemplate.query(sql,
          Peo.getRowMapper(), name, description, programId, priority, pageSize, offset);
      long total = peoRepo.count(name, description, programId, priority);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, peoList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getPeoList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getPeoList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postPeo(@PathVariable("programId") String programId, Peo peo) {
    BaseResponse response;
    try {
      Peo persistedPeo = peoRepo.findByProgramIdAndName(peo.getName(), programId);
      if (persistedPeo != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(peo);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, peo);
      log.info("postPeo SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), peo);
      log.error("postPeo FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postPeo ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putPeo(@PathVariable("programId") String programId,
      @PathVariable("name") String name, Peo peo) {
    BaseResponse response;
    try {
      Peo persistedPeo = peoRepo.findByProgramIdAndName(programId, name);
      if (persistedPeo == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      peoRepo.save(peo);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, peo);
      log.info("putPeo SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), peo);
      log.error("putPeo FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putPeo ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{name}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deletePeo(@PathVariable("programId") String programId,
      @PathVariable("name") String name) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM peo WHERE program_id = ? AND name = ?";
      jdbcTemplate.update(sql, programId, name);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deletePeo SUCCESS with programId: {}, name: {}", programId, name);
    } catch (Exception ex) {
      log.error("deletePeo ERROR with programId: {}, name: {}, exception: ", programId, name, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
