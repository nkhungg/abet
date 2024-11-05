package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.FoundationTestStatAnswer;
import abet.cse.model.FoundationTestStatByCorrectAnswer;
import abet.cse.model.FoundationTestStatByGrade;
import abet.cse.model.FoundationTestStatByIndicator;
import abet.cse.model.FoundationTestStatByOutcome;
import abet.cse.model.FoundationTestStatBySubject;
import abet.cse.model.FoundationTestStatByYear;
import abet.cse.repository.FoundationTestQuestionRepo;
import abet.cse.repository.FoundationTestStatRepo;
import abet.cse.repository.GradingFoundationTestRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("program-instances/{programInfo}/foundation-tests/{foundationTestId}/stat")
@RequiredArgsConstructor
@Slf4j
public class FoundationTestStatController {

  private final GradingFoundationTestRepo gradingFoundationTestRepo;
  private final FoundationTestQuestionRepo foundationTestQuestionRepo;
  private final FoundationTestStatRepo foundationTestStatRepo;

  @GetMapping(value = "subject", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStatisticsSubject(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      Long amount = gradingFoundationTestRepo.count(testId);
      List<FoundationTestStatBySubject> list = foundationTestStatRepo.statSubject(testId, amount);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, list);
      log.info("getStatisticsBySubject SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStatisticsBySubject ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "grade", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStatisticsGrade(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId,
      @RequestParam(value = "year", required = false) Integer year) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      Long amount = foundationTestQuestionRepo.countByTestId(testId);
      List<FoundationTestStatByGrade> list;
      if (year == null) {
        list = foundationTestStatRepo.statGrade(testId, amount);
      } else {
        list = foundationTestStatRepo.statGradeByYear(testId, amount, Utils.toSchoolYear(year));
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, list);
      log.info("getStatisticsByGrade SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStatisticsByGrade ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "year", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStatisticsYear(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId,
      @RequestParam(value = "grade", required = false) Integer grade) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      Long amount = foundationTestQuestionRepo.countByTestId(testId);
      List<FoundationTestStatByYear> list;
      if (grade == null) {
        list = foundationTestStatRepo.statYear(testId, amount);
      } else {
        list = foundationTestStatRepo.statYearByGrade(testId, amount, grade);
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, list);
      log.info("getStatisticsByYear SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStatisticsByYear ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "correct-answer", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStatisticsCorrectAnswer(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId,
      @RequestParam(value = "subjectId", required = false) Integer subjectId,
      @RequestParam(value = "outcomeName", required = false) String outcomeName,
      @RequestParam(value = "indicatorName", required = false) String indicatorName) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      Long amount = gradingFoundationTestRepo.count(testId);
      List<FoundationTestStatByCorrectAnswer> list;
      if (subjectId != null) {
        list = foundationTestStatRepo.statCorrectAnswerBySubjectId(testId, amount, subjectId);
      } else if (outcomeName != null) {
        list = foundationTestStatRepo.statCorrectAnswerByOutcomeName(testId, amount, outcomeName);
      } else if (indicatorName != null) {
        list = foundationTestStatRepo.statCorrectAnswerByIndicatorName(testId, amount, indicatorName);
      } else {
        list = foundationTestStatRepo.statCorrectAnswer(testId, amount);
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, list);
      log.info("getStatisticsCorrectAnswer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStatisticsCorrectAnswer ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "answer", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStatisticsAnswerByQuestion(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String testId,
      @RequestParam(value = "questionId", required = false) String questionId) {
    BaseResponse response;
    try {
      List<FoundationTestStatAnswer> list = foundationTestStatRepo.statAnswer(questionId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, list);
      log.info("getStatisticsAnswerByQuestion SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStatisticsAnswerByQuestion ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "outcome", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStatisticsOutcome(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      Long amount = gradingFoundationTestRepo.count(testId);
      List<FoundationTestStatByOutcome> list = foundationTestStatRepo.statOutcome(testId, amount);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, list);
      log.info("getStatisticsByOutcome SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStatisticsByOutcome ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "indicator", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStatisticsIndicator(@PathVariable("programInfo") String programInfo,
      @PathVariable("foundationTestId") String foundationTestId) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      Long amount = gradingFoundationTestRepo.count(testId);
      List<FoundationTestStatByIndicator> list = foundationTestStatRepo.statIndicator(testId, amount);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, list);
      log.info("getStatisticsByIndicator SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStatisticsByIndicator ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
