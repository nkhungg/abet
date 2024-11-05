package abet.cse.controller.assess;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.model.assess.ExitAssess;
import abet.cse.model.assess.ExitAssessExt;
import abet.cse.model.assess.ExitAssessStat;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.repository.SurveyRepo;
import abet.cse.repository.assess.ExitAssessRepo;
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
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/exit-result")
@RequiredArgsConstructor
@Slf4j
public class ExitAssessController {

  private final SurveyRepo surveyRepo;
  private final ExitAssessRepo exitAssessRepo;
  private final SurveyIndicatorRepo surveyIndicatorRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyExitAnswer(@PathVariable("programInfo") String programInfo,
      @PathVariable("surveyName") String surveyName,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<String> studentIdList = exitAssessRepo.find(surveyName, pageSize, offset);

      List<String> indicatorNameList = surveyIndicatorRepo.find(surveyName);
      List<ExitAssessExt> exitAssessExtList = exitAssessRepo.find(surveyName,
          studentIdList.get(0), studentIdList.get(studentIdList.size() - 1));

      Map<String, Map<String, ExitAssessExt>> studentIdMap = new TreeMap<>();
      for (ExitAssessExt intAssessExt : exitAssessExtList) {
        String studentId = intAssessExt.getStudentId();
        Map<String, ExitAssessExt> indicatorMap = studentIdMap.get(studentId);
        if (indicatorMap == null) {
          indicatorMap = new HashMap<>();
          studentIdMap.put(studentId, indicatorMap);
        }
        indicatorMap.put(intAssessExt.getIndicatorName(), intAssessExt);
      }

      List<MatrixRow> matrixRowList = new ArrayList<>();
      for (Map.Entry<String, Map<String, ExitAssessExt>> entry : studentIdMap.entrySet()) {
        MatrixRow<ExitAssess> matrixRow = new MatrixRow<>();
        List<ExitAssess> exitAssessList = new ArrayList<>();
        for (String indicatorName : indicatorNameList) {
          ExitAssessExt exitAssessExt = entry.getValue().get(indicatorName);
          if (exitAssessExt == null) exitAssessExt = new ExitAssessExt();
          exitAssessList.add(exitAssessExt);
        }
        matrixRow.setTitle(entry.getKey());
        matrixRow.setData(exitAssessList);
        matrixRowList.add(matrixRow);
      }

      indicatorNameList.add(0, Constant.STUDENT_ID);
      MatrixResponse matrixResponse = new MatrixResponse(indicatorNameList, matrixRowList);

      long total = exitAssessRepo.count(surveyName);
      int lastPage = Utils.calculateLastPage(total, pageSize);
      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSurveyExitAnswer SUCCESS");
    } catch (Exception ex) {
      log.error("getSurveyExitAnswer ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyStat(@PathVariable("surveyName") String surveyName) {
    BaseResponse response;
    try {
      List<ExitAssessStat> exitAssessList = exitAssessRepo.find(surveyName);
      Boolean isLock = surveyRepo.isLock(surveyName);
      Map<String, Object> map = new HashMap<>();
      map.put("stat", exitAssessList);
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
      @RequestBody List<ExitAssess> exitAssessList) {
    BaseResponse response;
    List<ExitAssess> errorAssessList = new ArrayList<>();
    try {
      List<ExitAssessStat> assessStatList = exitAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (ExitAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
      }
      for (ExitAssess exitAssess : exitAssessList) {
        try {
          String studentId = exitAssess.getStudentId();
          Integer surveyIndicatorId = exitAssess.getSurveyIndicatorId();
          Long count = exitAssessRepo.find(studentId, surveyIndicatorId);
          exitAssess.setLevel(markLevelMap.get(exitAssess.getMark()));
          if (count > 0)
            exitAssessRepo.update(studentId, surveyIndicatorId, exitAssess.getLevel(), exitAssess.getMark());
          else
            jdbcAggregateTemplate.insert(exitAssess);
        } catch (Exception ex) {
          log.error("postSurveyResult ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(exitAssess), ex);
          errorAssessList.add(exitAssess);
        }
      }
    } catch (Exception ex) {
      errorAssessList = exitAssessList;
      log.error("postSurveyResult ERROR with markLevelIdMap, exception: ", ex);
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("postSurveyResult SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyStat(@PathVariable("surveyName") String surveyName,
      @RequestBody List<ExitAssess> exitAssessList) {
    BaseResponse response;
    List<ExitAssess> errorAssessList = new ArrayList<>();
    for (ExitAssess exitAssess : exitAssessList) {
      try {
        exitAssessRepo.update(surveyName, exitAssess.getMark(), exitAssess.getLevel());
      } catch (Exception ex) {
        log.error("putSurveyStat ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(exitAssess), ex);
        errorAssessList.add(exitAssess);
      }
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("putSurveyStat SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody ExitAssess exitAssess) {
    BaseResponse response;
    try {
      exitAssessRepo.delete(surveyName, exitAssess.getStudentId());
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
    int titleCol = 2;
    try {
      List<Integer> idList = surveyIndicatorRepo.findIdList(surveyName);
      List<ExitAssessStat> assessStatList = exitAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (ExitAssessStat exitAssessStat : assessStatList) {
        markLevelMap.put(exitAssessStat.getMark(), exitAssessStat.getLevel());
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
        String studentId = null;
        try {
          studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          if (StringUtils.isBlank(studentId)) {
            errorAssess.put(studentId, Constant.INVALID_INPUT);
            continue;
          }
          exitAssessRepo.delete(surveyName, studentId);
          int size = Math.min(row.getPhysicalNumberOfCells(), idList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            ExitAssess exitAssess = new ExitAssess(
                studentId, idList.get(i - titleCol), markLevelMap.get(answer), answer);
            jdbcAggregateTemplate.insert(exitAssess);
          }
        } catch (Exception ex) {
          errorAssess.put(studentId, Constant.EXCEPTION);
          log.error("importAssess ERROR with studentId: {}", studentId, ex);
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
