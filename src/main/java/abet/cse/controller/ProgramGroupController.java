package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.ProgramGroup;
import abet.cse.repository.ProgramGroupRepo;
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
@RequestMapping("programs/{programId}/groups")
@RequiredArgsConstructor
@Slf4j
public class ProgramGroupController {

  private final ProgramGroupRepo programGroupRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getProgramGroupList(@PathVariable("programId") String programId,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<ProgramGroup> programGroupList = programGroupRepo.findByProgramId(programId, pageSize, offset);
      long total = programGroupRepo.countByProgramId(programId);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, programGroupList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getProgramGroupList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getProgramGroupList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postProgramGroup(@PathVariable("programId") String programId,
      @RequestBody ProgramGroup programGroup) {
    BaseResponse response;
    try {
      ProgramGroup persistedProgramGroup = programGroupRepo.findByProgramIdAndId(programId, programGroup.getId());
      if (persistedProgramGroup != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(programGroup);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, programGroup);
      log.info("postProgramGroup SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), programGroup);
      log.error("postProgramGroup FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postProgramGroup ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putProgramGroup(@PathVariable("programId") String programId,
      @PathVariable("id") int id, @RequestBody ProgramGroup programGroup) {
    BaseResponse response;
    try {
      ProgramGroup persistedProgramGroup = programGroupRepo.findByProgramIdAndId(programId, id);
      if (persistedProgramGroup == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      programGroupRepo.save(programGroup);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, programGroup);
      log.info("putProgramGroup SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), programGroup);
      log.error("putProgramGroup FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putProgramGroup ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteProgramGroup(@PathVariable("programId") String programId,
      @PathVariable("id") int id) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM program_group WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, programId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteProgramGroup SUCCESS with programId: {}, id: {}", programId, id);
    } catch (Exception ex) {
      log.error("deleteProgramGroup ERROR with programId: {}, id: {}, exception: ", programId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
