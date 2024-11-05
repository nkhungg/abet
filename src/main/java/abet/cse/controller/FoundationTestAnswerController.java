package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.model.FoundationTestAnswer;
import abet.cse.repository.FoundationTestAnswerRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.FileUtil;
import abet.cse.utils.ObjectUtils;
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
@RequestMapping("program-instances/{programInfo}/foundation-tests/{foundationTestId}/questions/{questionId}/answers")
@RequiredArgsConstructor
@Slf4j
public class FoundationTestAnswerController {

  private final FoundationTestAnswerRepo foundationTestAnswerRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getFoundationTestAnswerList(@PathVariable("questionId") String foundationQuestionId) {
    BaseResponse response;
    try {
      String questionId = foundationQuestionId.replaceAll(Constant.HYPHEN, Constant.DASH);
      List<FoundationTestAnswer> answerList = foundationTestAnswerRepo.find(questionId);

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, answerList);
      log.info("getFoundationTestAnswerList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getFoundationTestAnswerList ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postFoundationTestAnswer(@PathVariable("questionId") String foundationQuestionId,
      FoundationTestAnswer answer, @RequestParam(value = "image", required = false) MultipartFile imageFile) {
    BaseResponse response;
    try {
      String questionId = foundationQuestionId.replaceAll(Constant.HYPHEN, Constant.DASH);
      answer.setField(questionId);
      Long count = foundationTestAnswerRepo.find(answer.getQuestionId(), answer.getAnswerId());
      if (count > 0) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      if (Objects.nonNull(imageFile) && !imageFile.isEmpty()) {
        String postfixSolution = FileUtil.getFileExt(imageFile);
        String filename = answer.getQuestionId() + Constant.DASH + answer.getAnswerId() + Constant.DASH + System.currentTimeMillis() + postfixSolution;
        FileUtil.saveFile(imageFile, Constant.UPLOAD_DIR, filename);
        answer.setImage(filename);
      }

      jdbcAggregateTemplate.insert(answer);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, answer);
      log.info("postFoundationTestAnswer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), answer);
      log.error("postFoundationTestAnswer FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postFoundationTestAnswer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putFoundationTestAnswer(@PathVariable("questionId") String foundationQuestionId,
      @PathVariable("id") String id, FoundationTestAnswer answer,
      @RequestParam(value = "image", required = false) MultipartFile imageFile) {
    BaseResponse response;
    try {
      String questionId = foundationQuestionId.replaceAll(Constant.HYPHEN, Constant.DASH);
      answer.setQuestionId(questionId);
      Long count = foundationTestAnswerRepo.find(answer.getQuestionId(), id);
      if (count == 0) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      if (Objects.nonNull(imageFile) && !imageFile.isEmpty()) {
        String postfixSolution = FileUtil.getFileExt(imageFile);
        String filename = answer.getQuestionId() + Constant.DASH + answer.getAnswerId() + Constant.DASH + System.currentTimeMillis() + postfixSolution;
        FileUtil.saveFile(imageFile, Constant.UPLOAD_DIR, filename);
        answer.setImage(filename);
      }

      String sql = "UPDATE foundation_test_answer SET " + answer.toSql() + " WHERE question_id = ? AND answer_id = ?";
      jdbcTemplate.update(sql, answer.getQuestionId(), id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, answer);
      log.info("putFoundationTestAnswer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), answer);
      log.error("putFoundationTestAnswer FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putFoundationTestAnswer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteFoundationTestAnswer(
      @PathVariable("questionId") String foundationQuestionId, @PathVariable("id") String id) {
    BaseResponse response;
    String questionId = foundationQuestionId.replaceAll(Constant.HYPHEN, Constant.DASH);
    try {
      String answerId = id.replaceAll(Constant.HYPHEN, Constant.DASH);
      foundationTestAnswerRepo.delete(questionId, answerId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteFoundationTestAnswer SUCCESS with questionId: {}, id: {}", questionId, id);
    } catch (Exception ex) {
      log.error("deleteFoundationTestAnswer ERROR with questionId: {}, id: {}", questionId, id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
