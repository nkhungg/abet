package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Semester;
import abet.cse.repository.SemesterRepo;
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
@RequestMapping("programs/{programId}/semesters")
@RequiredArgsConstructor
@Slf4j
public class SemesterController {

  private final SemesterRepo semesterRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSemesterList(@PathVariable("programId") String programId,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<Semester> semesterList = semesterRepo.findByProgramId(programId, pageSize, offset);
      long total = semesterRepo.countByProgramId(programId);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, semesterList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSemesterList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSemesterList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postSemester(@PathVariable("programId") String programId,
      @RequestBody Semester semester) {
    BaseResponse response;
    try {
      Semester persistedSemester = semesterRepo.findByProgramIdAndId(programId, semester.getId());
      if (persistedSemester != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(semester);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, semester);
      log.info("postSemester SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), semester);
      log.error("postSemester FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postSemester ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSemester(@PathVariable("programId") String programId,
      @PathVariable("id") int id, @RequestBody Semester semester) {
    BaseResponse response;
    try {
      Semester persistedSemester = semesterRepo.findByProgramIdAndId(programId, id);
      if (persistedSemester == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      semesterRepo.save(semester);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, semester);
      log.info("putSemester SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), semester);
      log.error("putSemester FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putSemester ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSemester(@PathVariable("programId") String programId,
      @PathVariable("id") int id) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM semester WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, programId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteSemester SUCCESS with programId: {}, id: {}", programId, id);
    } catch (Exception ex) {
      log.error("deleteSemester ERROR with programId: {}, id: {}, exception: ", programId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
