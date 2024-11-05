package abet.cse.controller.assess;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRowExt;
import abet.cse.model.assess.CeParticipantAssess;
import abet.cse.model.assess.CeParticipantAssessExt;
import abet.cse.model.assess.CeParticipantAssessStat;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.repository.SurveyRepo;
import abet.cse.repository.assess.CeParticipantAssessRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.FileUtil;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/ce-participant-result")
@RequiredArgsConstructor
@Slf4j
public class CeParticipantAssessController {

  private final SurveyRepo surveyRepo;
  private final CeParticipantAssessRepo ceParticipantAssessRepo;
  private final SurveyIndicatorRepo surveyIndicatorRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyResult(@PathVariable("programInfo") String programInfo,
      @PathVariable("surveyName") String surveyName,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<String> participantStudentList = ceParticipantAssessRepo.find(surveyName, pageSize, offset);
      List<String> indicatorNameList = surveyIndicatorRepo.find(surveyName);
      List<CeParticipantAssessExt> ceParticipantAssessExtList = new ArrayList<>();
      if (participantStudentList.size() > 0) {
        ceParticipantAssessExtList = ceParticipantAssessRepo.find(surveyName, participantStudentList.get(0),
            participantStudentList.get(participantStudentList.size() - 1));
      }

      Map<String, Map<String, CeParticipantAssessExt>> studentIdMap = new TreeMap<>();
      for (CeParticipantAssessExt ceParticipantAssessExt : ceParticipantAssessExtList) {
        String studentId = ceParticipantAssessExt.getParticipant()
            + Constant.DASH + ceParticipantAssessExt.getStudentId()
            + Constant.DASH + ceParticipantAssessExt.getStudentName();
        Map<String, CeParticipantAssessExt> indicatorMap = studentIdMap.get(studentId);
        if (indicatorMap == null) {
          indicatorMap = new HashMap<>();
          studentIdMap.put(studentId, indicatorMap);
        }
        indicatorMap.put(ceParticipantAssessExt.getIndicatorName(), ceParticipantAssessExt);
      }

      List<MatrixRowExt> matrixRowList = new ArrayList<>();
      for (Map.Entry<String, Map<String, CeParticipantAssessExt>> entry : studentIdMap.entrySet()) {
        MatrixRowExt<CeParticipantAssessExt> matrixRow = new MatrixRowExt<>();
        List<CeParticipantAssessExt> ceParticipantAssessList= new ArrayList<>();
        for (String indicatorName : indicatorNameList) {
          CeParticipantAssessExt ceParticipantAssessExt = entry.getValue().get(indicatorName);
          if (ceParticipantAssessExt == null) ceParticipantAssessExt = new CeParticipantAssessExt();
          ceParticipantAssessList.add(ceParticipantAssessExt);
        }
        String[] arr = entry.getKey().split(Constant.DASH);
        matrixRow.setTitle(arr[0]);
        matrixRow.setSubTitle(arr[1]);
        matrixRow.setSubSubTitle(arr[2]);
        matrixRow.setData(ceParticipantAssessList);
        matrixRowList.add(matrixRow);
      }

      indicatorNameList.add(0, Constant.PARTICIPANT);
      indicatorNameList.add(1, Constant.STUDENT);
      indicatorNameList.add(2, Constant.STUDENT_ID);
      MatrixResponse matrixResponse = new MatrixResponse(indicatorNameList, matrixRowList);

      long total = ceParticipantAssessRepo.count(surveyName);
      int lastPage = Utils.calculateLastPage(total, pageSize);
      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSurveyResult SUCCESS");
    } catch (Exception ex) {
      log.error("getSurveyResult ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyStat(@PathVariable("surveyName") String surveyName) {
    BaseResponse response;
    try {
      List<CeParticipantAssessStat> ceHdAssessStatList = ceParticipantAssessRepo.find(surveyName);
      Boolean isLock = surveyRepo.isLock(surveyName);
      Map<String, Object> map = new HashMap<>();
      map.put("stat", ceHdAssessStatList);
      map.put("isLock", isLock);

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, map);
      log.info("getSurveyStat SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSurveyStat ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody List<CeParticipantAssess> ceParticipantAssessList) {
    BaseResponse response;
    List<CeParticipantAssess> errorAssessList = new ArrayList<>();
    try {
      List<CeParticipantAssessStat> assessStatList = ceParticipantAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (CeParticipantAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
      }
      for (CeParticipantAssess ceParticipantAssess : ceParticipantAssessList) {
        try {
          String participant = ceParticipantAssess.getParticipant();
          String studentId = ceParticipantAssess.getStudentId();
          Integer surveyIndicatorId = ceParticipantAssess.getSurveyIndicatorId();
          ceParticipantAssess.setLevel(markLevelMap.get(ceParticipantAssess.getMark()));
          Integer count = ceParticipantAssessRepo.count(participant, studentId, surveyIndicatorId);
          if (count > 0) {
            ceParticipantAssessRepo.update(participant, studentId, surveyIndicatorId,
                ceParticipantAssess.getLevel(), ceParticipantAssess.getMark());
          } else {
            jdbcAggregateTemplate.insert(ceParticipantAssess);
          }
        } catch (Exception ex) {
          log.error("postSurveyResult ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(ceParticipantAssess), ex);
          errorAssessList.add(ceParticipantAssess);
        }
      }
    } catch (Exception ex) {
      errorAssessList = ceParticipantAssessList;
      log.error("postSurveyResult ERROR with markLevelIdMap, exception: ", ex);
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("postSurveyResult SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyStat(@PathVariable("surveyName") String surveyName,
      @RequestBody List<CeParticipantAssess> ceParticipantAssessList) {
    BaseResponse response;
    List<CeParticipantAssess> errorAssessList = new ArrayList<>();
    for (CeParticipantAssess ceParticipantAssess : ceParticipantAssessList) {
      try {
        ceParticipantAssessRepo.update(surveyName, ceParticipantAssess.getMark(), ceParticipantAssess.getLevel());
      } catch (Exception ex) {
        log.error("putSurveyStat ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(ceParticipantAssess), ex);
        errorAssessList.add(ceParticipantAssess);
      }
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("putSurveyStat SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody CeParticipantAssess ceParticipantAssess) {
    BaseResponse response;
    try {
      ceParticipantAssessRepo.delete(surveyName, ceParticipantAssess.getParticipant(), ceParticipantAssess.getStudentId());
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteSurveyResult SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("deleteSurveyResult ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(value = "{import}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity importAssess(@PathVariable("surveyName") String surveyName,
      @RequestParam(value = "sheet", defaultValue = "1") Integer sheetIdx,
      @RequestParam("file") MultipartFile multipartFile) {
    BaseResponse response;
    Map<String, String> errorAssess = new TreeMap<>();
    int titleCol = 4;
    try {
      List<Integer> idList = surveyIndicatorRepo.findIdList(surveyName);
      List<CeParticipantAssessStat> assessStatList = ceParticipantAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (CeParticipantAssessStat ceParticipantAssessStat : assessStatList) {
        markLevelMap.put(ceParticipantAssessStat.getMark(), ceParticipantAssessStat.getLevel());
      }

      File file = FileUtil.convertMultiPartToFile(multipartFile);
      InputStream inputStream = new FileInputStream(file);
      XSSFWorkbook wb = new XSSFWorkbook(inputStream);
      XSSFSheet sheet = wb.getSheetAt(sheetIdx - 1);
      FormulaEvaluator formulaEvaluator = wb.getCreationHelper().createFormulaEvaluator();

      for (Row row: sheet) {
        if (row.getPhysicalNumberOfCells() < titleCol + 1) continue;
        Cell firstCell = row.getCell(0);

        if (formulaEvaluator.evaluateInCell(firstCell).getCellType().name().equalsIgnoreCase(Constant.STRING)
            && (firstCell.getStringCellValue().equalsIgnoreCase(Constant.NO_DOT)
            || firstCell.getStringCellValue().equalsIgnoreCase(Constant.NO)
            || firstCell.getStringCellValue().equalsIgnoreCase(Constant.STT))) {
          continue;
        }
        int i = 1;
        String participant = null;
        String studentName = null;
        String studentId = null;
        try {
          participant = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          studentName = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          if (StringUtils.isBlank(participant) || StringUtils.isBlank(studentId)) {
            errorAssess.put(participant + Constant.DASH + studentId, Constant.INVALID_INPUT);
            continue;
          }
          ceParticipantAssessRepo.delete(surveyName, participant, studentId);
          int size = Math.min(row.getPhysicalNumberOfCells(), idList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            CeParticipantAssess ceParticipantAssess = new CeParticipantAssess(participant,
                studentName, studentId, idList.get(i - titleCol), markLevelMap.get(answer), answer);
            jdbcAggregateTemplate.insert(ceParticipantAssess);
          }
        } catch (Exception ex) {
          errorAssess.put(participant + Constant.DASH + studentId, Constant.EXCEPTION);
          log.error("importAssess ERROR with participant: {}, studentId: {}", participant, studentId, ex);
        }
      }
      response = errorAssess.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
          : new BaseResponse(AbetCseStatusEnum.IMPORT_SURVEY_ASSESS_FAILED, ObjectUtils.toJsonString(errorAssess));
      log.info("importAssess SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("importAssess ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, ObjectUtils.toJsonString(errorAssess));
    } finally {
      FileUtil.removeFile(multipartFile);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
