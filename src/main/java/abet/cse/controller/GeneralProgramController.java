package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.GeneralProgram;
import abet.cse.repository.GeneralProgramRepo;
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
@RequestMapping("general-programs")
@RequiredArgsConstructor
@Slf4j
public class GeneralProgramController {

  private final GeneralProgramRepo generalProgramRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getGeneralProgramList(
      @RequestParam(value = "id", defaultValue = "") String id,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "major", defaultValue = "") String major,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM general_program where IFNULL(id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(major, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<GeneralProgram> programList = jdbcTemplate.query(sql,
          GeneralProgram.getRowMapper(), id, name, description, major, pageSize, offset);
      long total = generalProgramRepo.count(id, name, description, major);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, programList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getGeneralProgramList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getGeneralProgramList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postGeneralProgram(GeneralProgram generalProgram) {
    BaseResponse response;
    try {
      boolean isExisted = generalProgramRepo.existsById(generalProgram.getId());
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(generalProgram);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, generalProgram);
      log.info("postGeneralProgram SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), generalProgram);
      log.error("postGeneralProgram FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
      log.error("postGeneralProgram ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putGeneralProgram(@PathVariable("id") String id, GeneralProgram generalProgram) {
    BaseResponse response;
    try {
      boolean isExisted = generalProgramRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      generalProgramRepo.save(generalProgram);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, generalProgram);
      log.info("putGeneralProgram SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), generalProgram);
      log.error("putGeneralProgram FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
      log.error("putGeneralProgram ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteGeneralProgram(@PathVariable("id") String id) {
    BaseResponse response;
    try {
      generalProgramRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteGeneralProgram SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteGeneralProgram ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
