package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.model.SurveyKind;
import abet.cse.repository.SurveyKindRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("survey-kinds")
@RequiredArgsConstructor
@Slf4j
public class SurveyKindController {

  private final SurveyKindRepo surveyKindRepo;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyKindList() {
    BaseResponse response;
    try {
      List<SurveyKind> surveyKindList = (List<SurveyKind>) surveyKindRepo.findAll();
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, surveyKindList);
      log.info("getSurveyKindList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSurveyKindList ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
