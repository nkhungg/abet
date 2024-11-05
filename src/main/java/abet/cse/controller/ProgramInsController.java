package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.ProgramIns;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("program-instances")
@RequiredArgsConstructor
@Slf4j
public class ProgramInsController {

  private final ProgramInsRepo programInsRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getProgramInstanceList(
      @RequestParam(value = "programId", defaultValue = "") String programId,
      @RequestParam(value = "year", defaultValue = "") String year,
      @RequestParam(value = "semester", defaultValue = "") String semester,
      @RequestParam(value = "sortBy", defaultValue = "program_id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM program_instance where IFNULL(program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(year, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(semester, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<ProgramIns> programInsList = jdbcTemplate.query(sql,
          ProgramIns.getRowMapper(), programId, year, semester, pageSize, offset);
      long total = programInsRepo.count(programId, year, semester);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, programInsList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getProgramInstanceList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getProgramInstanceList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postProgramInstance(@RequestBody ProgramIns programIns) {
    BaseResponse response;
    try {
      ProgramIns persistedObject = programInsRepo.save(programIns);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, persistedObject);
      log.info("postProgramInstance SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, programIns);
      log.error("postProgramInstance ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putProgramInstance(@PathVariable("id") Integer id,
      @RequestBody ProgramIns generalProgram) {
    BaseResponse response;
    try {
      boolean isExisted = programInsRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      programInsRepo.save(generalProgram);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, generalProgram);
      log.info("putProgramInstance SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), generalProgram);
      log.error("putProgramInstance FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
      log.error("putProgramInstance ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteProgramInstance(@PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      programInsRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteProgramInstance SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteProgramInstance ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
