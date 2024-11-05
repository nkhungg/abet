package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Program;
import abet.cse.repository.ProgramRepo;
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
@RequestMapping("programs")
@RequiredArgsConstructor
@Slf4j
public class ProgramController {

  private final ProgramRepo programRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getProgramList(
      @RequestParam(value = "idGeneralProgram", defaultValue = "") String idGeneralProgram,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "major", defaultValue = "") String major,
      @RequestParam(value = "id", defaultValue = "") String id,
      @RequestParam(value = "start", defaultValue = "") String start,
      @RequestParam(value = "end", defaultValue = "") String end,
      @RequestParam(value = "apply", defaultValue = "") String apply,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM program where IFNULL(id_general_program, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(major, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(start, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(end, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(apply, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Program> programList = jdbcTemplate.query(sql,
          Program.getRowMapper(), idGeneralProgram, description, major, id, start, end, apply, pageSize, offset);
      long total = programRepo.count(idGeneralProgram, description, major, id, start, end, apply);;
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, programList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getProgramList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getProgramList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postProgram(Program program) {
    BaseResponse response;
    try {
      boolean isCourseExisted = programRepo.existsById(program.getId());
      if (isCourseExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(program);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, program);
      log.info("postProgram SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), program);
      log.error("postProgram FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postProgram ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putProgram(@PathVariable("id") String id, Program program) {
    BaseResponse response;
    try {
      boolean isCourseExisted = programRepo.existsById(id);
      if (!isCourseExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      programRepo.save(program);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, program);
      log.info("putProgram SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), program);
      log.error("putProgram FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putProgram ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteProgram(@PathVariable("id") String id) {
    BaseResponse response;
    try {
      programRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteProgram SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteProgram ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
