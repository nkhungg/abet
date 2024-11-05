package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.ThesisProjectLecturer;
import abet.cse.repository.ThesisProjectLecturerRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/theses/{projectId}/lecturers")
@RequiredArgsConstructor
@Slf4j
public class ThesisProjectLecturerController {

  private final ThesisProjectLecturerRepo thesisProjectLecturerRepo;
  private final JdbcTemplate jdbcTemplate;

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postThesisProjectLecturer(@PathVariable("programInfo") String programInfo,
      @PathVariable("projectId") String projectId,
      @RequestBody ThesisProjectLecturer thesisProjectLecturer) {
    BaseResponse response;
    try {
      thesisProjectLecturer.setProjectId(projectId);
      thesisProjectLecturerRepo.save(thesisProjectLecturer);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, thesisProjectLecturer);
      log.info("postThesisProjectLecturer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postThesisProjectLecturer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putThesisProjectLecturer(@PathVariable("programInfo") String programInfo,
      @PathVariable("id") String id, @RequestBody ThesisProjectLecturer thesisProjectLecturer) {
    BaseResponse response;
    try {
      boolean isExisted = thesisProjectLecturerRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE thesis_project_lecturer SET " + thesisProjectLecturer.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, thesisProjectLecturer);
      log.info("putThesisProjectLecturer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), thesisProjectLecturer);
      log.error("putThesisProjectLecturer FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putThesisProjectLecturer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteThesisProjectLecturer(@PathVariable("programInfo") String programInfo,
      @PathVariable("projectId") String projectId, @PathVariable("id") String id) {
    BaseResponse response;
    try {
      thesisProjectLecturerRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteThesisProjectLecturer SUCCESS with programInfo: {}, id: {}", programInfo, id);
    } catch (Exception ex) {
      log.error("deleteThesisProjectLecturer ERROR with programInfo: {}, id: {}", programInfo, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
