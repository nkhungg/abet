package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.FoundationTestSubject;
import abet.cse.model.FoundationTestSubjectExt;
import abet.cse.repository.FoundationTestSubjectRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/foundation-tests/{foundationTestId}/subjects")
@RequiredArgsConstructor
@Slf4j
public class FoundationTestSubjectController {

  private final FoundationTestSubjectRepo foundationTestSubjectRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getFoundationTestSubjectList(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId,
      @RequestParam(value = "subjectName", defaultValue = "") String subjectName,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);

      String sql = "SELECT a.*, b.name AS subject_name FROM foundation_test_subject AS a LEFT JOIN subject AS b"
          + " ON a.subject_id = b.id WHERE IFNULL(foundation_test_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<FoundationTestSubjectExt> subjectList = jdbcTemplate.query(sql,
          FoundationTestSubjectExt.getRowMapper(), testId, subjectName, pageSize, offset);
      for (FoundationTestSubjectExt subject : subjectList) {
        subject.setProgramVersionInfo(programInfo);
      }
      Long total = foundationTestSubjectRepo.count(testId, subjectName);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, subjectList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getFoundationTestSubjectList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getFoundationTestSubjectList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postFoundationTestSubject(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId,
      @RequestBody List<Integer> subjectIdList) {
    BaseResponse response;
    try {
      List<FoundationTestSubject> subjectList = new ArrayList<>();
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      for (Integer subjectId: subjectIdList) {
        FoundationTestSubject subject = new FoundationTestSubject(subjectId, testId);
        subjectList.add(subject);
      }
      foundationTestSubjectRepo.saveAll(subjectList);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, subjectList);
      log.info("postFoundationTestSubject SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postFoundationTestSubject ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteFoundationTestSubject(@PathVariable("id") Integer id) {
    BaseResponse response;
    try {
      foundationTestSubjectRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteFoundationTestSubject SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteFoundationTestSubject ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
