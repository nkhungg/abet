package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.FoundationTestQuestion;
import abet.cse.model.FoundationTestQuestionExt;
import abet.cse.repository.FoundationTestQuestionRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.FileUtil;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import java.util.Objects;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("program-instances/{programInfo}/foundation-tests/{foundationTestId}/questions")
@RequiredArgsConstructor
@Slf4j
public class FoundationTestQuestionController {

  private final FoundationTestQuestionRepo foundationTestQuestionRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getFoundationTestQuestionList(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "content", defaultValue = "") String content,
      @RequestParam(value = "answer", defaultValue = "") String answer,
      @RequestParam(value = "percent", defaultValue = "") String percent,
      @RequestParam(value = "outcomeName", defaultValue = "") String outcomeName,
      @RequestParam(value = "level", defaultValue = "") String level,
      @RequestParam(value = "subjectName", defaultValue = "") String subjectName,
      @RequestParam(value = "lecturerName", defaultValue = "") String lecturerName,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      String sql = "SELECT a.*, b.name AS subject_name, c.name AS lecturer_name,"
          + " GROUP_CONCAT(CONCAT(d.answer_id, '_', IFNULL(d.description, ''), '_', IFNULL(d.image, '')) SEPARATOR '|') AS answer_str"
          + " FROM foundation_test_question AS a LEFT JOIN subject AS b ON a.subject_id = b.id"
          + " LEFT JOIN lecturer AS c ON a.lecturer_id = c.id"
          + " LEFT JOIN foundation_test_answer AS d ON a.id = d.question_id"
          + " WHERE IFNULL(a.test_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.content, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.answer, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.percent, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.outcome_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.level, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(c.name, '') LIKE CONCAT('%',?,'%') GROUP BY a.id"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<FoundationTestQuestionExt> questionList = jdbcTemplate.query(sql,
          FoundationTestQuestionExt.getRowMapper(), testId, name, content, answer, percent,
          outcomeName, level, subjectName, lecturerName, pageSize, offset);
      for (FoundationTestQuestionExt question : questionList) {
        question.setProgramVersionInfo(programInfo);
      }
      long total = foundationTestQuestionRepo.count(testId, name, content, answer, percent,
          outcomeName, level, subjectName, lecturerName);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, questionList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getFoundationTestQuestionList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getFoundationTestQuestionList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postFoundationTestQuestion(@PathVariable("foundationTestId") String foundationTestId,
      FoundationTestQuestion foundationTestQuestion, @RequestParam(value = "image", required = false) MultipartFile imageFile) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      foundationTestQuestion.setField(testId);
      boolean isExisted = foundationTestQuestionRepo.existsById(foundationTestQuestion.getId());
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      if (Objects.nonNull(imageFile) && !imageFile.isEmpty()) {
        String postfixSolution = FileUtil.getFileExt(imageFile);
        String filename = foundationTestQuestion.getId() + Constant.DASH + System.currentTimeMillis() + postfixSolution;
        FileUtil.saveFile(imageFile, Constant.UPLOAD_DIR, filename);
        foundationTestQuestion.setImage(filename);
      }

      jdbcAggregateTemplate.insert(foundationTestQuestion);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, foundationTestQuestion);
      log.info("postFoundationTestQuestion SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), foundationTestQuestion);
      log.error("postFoundationTestQuestion FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postFoundationTestQuestion ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putFoundationTestQuestion(@PathVariable("programInfo") String programInfo,
      @PathVariable("id") String id, FoundationTestQuestion foundationTestQuestion,
      @RequestParam(value = "image", required = false) MultipartFile imageFile) {
    BaseResponse response;
    try {
      String questionId = id.replaceAll(Constant.HYPHEN, Constant.DASH);
      boolean isExisted = foundationTestQuestionRepo.existsById(questionId);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      if (Objects.nonNull(imageFile) && !imageFile.isEmpty()) {
        String postfixSolution = FileUtil.getFileExt(imageFile);
        String filename = foundationTestQuestion.getId() + Constant.DASH + System.currentTimeMillis() + postfixSolution;
        FileUtil.saveFile(imageFile, Constant.UPLOAD_DIR, filename);
        foundationTestQuestion.setImage(filename);
      }

      String sql = "UPDATE foundation_test_question SET " + foundationTestQuestion.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, questionId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, foundationTestQuestion);
      log.info("putFoundationTestQuestion SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), foundationTestQuestion);
      log.error("putFoundationTestQuestion FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putFoundationTestQuestion ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteFoundationTestQuestion(
      @PathVariable("programInfo") String programInfo, @PathVariable("id") String id) {
    BaseResponse response;
    try {
      String questionId = id.replaceAll(Constant.HYPHEN, Constant.DASH);
      foundationTestQuestionRepo.deleteById(questionId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteFoundationTestQuestion SUCCESS with programInfo: {}, id: {}", programInfo, id);
    } catch (Exception ex) {
      log.error("deleteFoundationTestQuestion ERROR with programInfo: {}, id: {}", programInfo, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
