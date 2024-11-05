package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.ThesisProject;
import abet.cse.model.ThesisProjectExt;
import abet.cse.model.ThesisProjectLecturer;
import abet.cse.model.ThesisProjectLecturerExt;
import abet.cse.repository.ThesisProjectLecturerRepo;
import abet.cse.repository.ThesisProjectRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/theses")
@RequiredArgsConstructor
@Slf4j
public class ThesisProjectController {

  private final ThesisProjectRepo thesisProjectRepo;
  private final ThesisProjectLecturerRepo thesisProjectLecturerRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getThesisProjectList(@PathVariable("programInfo") String programInfo,
      @RequestParam(value = "projectName", defaultValue = "") String projectName,
      @RequestParam(value = "council", defaultValue = "") String council,
      @RequestParam(value = "reviewerName", defaultValue = "") String reviewerName,
      @RequestParam(value = "sortBy", defaultValue = "project_name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String[] array = programInfo.split(Constant.HYPHEN);
      int year = Integer.parseInt(array[1]);
      int semester = Integer.parseInt(array[2]);

      String sql = "SELECT a.*, name AS reviewer_name FROM thesis_project AS a LEFT JOIN lecturer AS b ON a.reviewer_id = b.id"
          + " WHERE year = ? AND semester = ? AND a.project_id LIKE 'PROJ_%'"
          + " AND IFNULL(a.project_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.council, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<ThesisProjectExt> thesisProjectList = jdbcTemplate.query(sql,
          ThesisProjectExt.getRowMapper(), year, semester, projectName, council, reviewerName, pageSize, offset);
      for (ThesisProjectExt thesisProjectExt : thesisProjectList) {
        List<ThesisProjectLecturerExt> lecturerList = thesisProjectLecturerRepo.find(thesisProjectExt.getProjectId());
        thesisProjectExt.setLecturerList(lecturerList);
        boolean isMultiMajor = StringUtils.isBlank(thesisProjectExt.getProgramId()) ? true : false;
        thesisProjectExt.setMultiMajor(isMultiMajor);
      }

      long total = thesisProjectRepo.count(year, semester, projectName, council, reviewerName);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, thesisProjectList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getThesisProjectList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getThesisProjectList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postThesisProject(@PathVariable("programInfo") String programInfo,
      @RequestBody ThesisProjectExt thesisProject) {
    BaseResponse response;
    try {
      thesisProject.setField(programInfo, thesisProjectRepo, thesisProject.isMultiMajor());
      thesisProjectLecturerRepo.save(new ThesisProjectLecturer(thesisProject));
      jdbcAggregateTemplate.insert(new ThesisProject(thesisProject));
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, thesisProject);
      log.info("postThesisProject SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postThesisProject ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putThesisProject(@PathVariable("programInfo") String programInfo,
      @PathVariable("id") String id, @RequestBody ThesisProjectExt thesisProject) {
    BaseResponse response;
    try {
      boolean isExisted = thesisProjectRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE thesis_project SET " + thesisProject.toSql(programInfo, thesisProject.isMultiMajor()) + " WHERE project_id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, thesisProject);
      log.info("putThesisProject SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), thesisProject);
      log.error("putThesisProject FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putThesisProject ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional
  public ResponseEntity deleteThesisProject(@PathVariable("programInfo") String programInfo,
      @PathVariable("id") String id) {
    BaseResponse response;
    try {
      thesisProjectRepo.deleteById(id);
      thesisProjectLecturerRepo.delete(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteThesisProject SUCCESS with programInfo: {}, id: {}", programInfo, id);
    } catch (Exception ex) {
      log.error("deleteThesisProject ERROR with programInfo: {}, id: {}", programInfo, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
