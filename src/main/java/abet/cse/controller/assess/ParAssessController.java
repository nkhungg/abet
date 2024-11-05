package abet.cse.controller.assess;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.model.assess.ParAssess;
import abet.cse.model.assess.ParAssessExt;
import abet.cse.model.assess.ParAssessStat;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.repository.SurveyRepo;
import abet.cse.repository.ThesisProjectRepo;
import abet.cse.repository.assess.ParAssessRepo;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/participant-result")
@RequiredArgsConstructor
@Slf4j
public class ParAssessController {

  private final SurveyRepo surveyRepo;
  private final ThesisProjectRepo thesisProjectRepo;
  private final ParAssessRepo parAssessRepo;
  private final SurveyIndicatorRepo surveyIndicatorRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyResult(@PathVariable("programInfo") String programInfo,
      @PathVariable("surveyName") String surveyName,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<String> projectStudentList = parAssessRepo.find(surveyName, pageSize, offset);
      List<String> indicatorNameList = surveyIndicatorRepo.find(surveyName);

      List<ParAssessExt> parAssessExtList = new ArrayList<>();
      if (projectStudentList.size() > 0) {
        parAssessExtList = parAssessRepo.find(surveyName, projectStudentList.get(0),
            projectStudentList.get(projectStudentList.size() -1));
      }

      Map<String, Map<String, ParAssessExt>> studentIdMap = new TreeMap<>();
      for (ParAssessExt parAssessExt : parAssessExtList) {
        String studentId = parAssessExt.getProjectId() + Constant.DASH_SV + parAssessExt.getStudentId();
        Map<String, ParAssessExt> indicatorMap = studentIdMap.get(studentId);
        if (indicatorMap == null) {
          indicatorMap = new HashMap<>();
          studentIdMap.put(studentId, indicatorMap);
        }
        indicatorMap.put(parAssessExt.getIndicatorName(), parAssessExt);
      }

      List<MatrixRow> matrixRowList = new ArrayList<>();
      for (Map.Entry<String, Map<String, ParAssessExt>> entry : studentIdMap.entrySet()) {
        MatrixRow<ParAssess> matrixRow = new MatrixRow<>();
        List<ParAssess> parAssessList = new ArrayList<>();
        for (String indicatorName : indicatorNameList) {
          ParAssessExt parAssessExt = entry.getValue().get(indicatorName);
          if (parAssessExt == null) parAssessExt = new ParAssessExt();
          parAssessList.add(parAssessExt);
        }
        matrixRow.setTitle(entry.getKey());
        matrixRow.setData(parAssessList);
        matrixRowList.add(matrixRow);
      }

      indicatorNameList.add(0, Constant.STUDENT_ID);
      MatrixResponse matrixResponse = new MatrixResponse(indicatorNameList, matrixRowList);

      long total = parAssessRepo.count(surveyName);
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
      List<ParAssessStat> revAssessList = parAssessRepo.find(surveyName);
      Boolean isLock = surveyRepo.isLock(surveyName);
      Map<String, Object> map = new HashMap<>();
      map.put("stat", revAssessList);
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
      @RequestBody List<ParAssess> parAssessList) {
    BaseResponse response;
    List<ParAssess> errorAssessList = new ArrayList<>();
    try {
      List<ParAssessStat> assessStatList = parAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (ParAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
      }
      for (ParAssess parAssess : parAssessList) {
        try {
          String projectId = parAssess.getProjectId();
          String studentId = parAssess.getStudentId();
          Integer surveyIndicatorId = parAssess.getSurveyIndicatorId();
          parAssess.setLevel(markLevelMap.get(parAssess.getMark()));
          Integer count = parAssessRepo.count(projectId, studentId, surveyIndicatorId);
          if (count > 0) {
            parAssessRepo.update(projectId, studentId, surveyIndicatorId,
                parAssess.getLevel(), parAssess.getMark());
          } else {
            jdbcAggregateTemplate.insert(parAssess);
          }
        } catch (Exception ex) {
          log.error("postSurveyResult ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(parAssess), ex);
          errorAssessList.add(parAssess);
        }
      }
    } catch (Exception ex) {
      errorAssessList = parAssessList;
      log.error("postSurveyResult ERROR with markLevelIdMap, exception: ", ex);
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("postSurveyResult SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyStat(@PathVariable("surveyName") String surveyName,
      @RequestBody List<ParAssess> parAssessList) {
    BaseResponse response;
    List<ParAssess> errorAssessList = new ArrayList<>();
    for (ParAssess parAssess : parAssessList) {
      try {
        parAssessRepo.update(surveyName, parAssess.getMark(), parAssess.getLevel());
      } catch (Exception ex) {
        log.error("putSurveyStat ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(parAssess), ex);
        errorAssessList.add(parAssess);
      }
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("putSurveyStat SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody ParAssess parAssess) {
    BaseResponse response;
    try {
      parAssessRepo.delete(surveyName, parAssess.getProjectId(), parAssess.getStudentId());
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
      List<ParAssessStat> assessStatList = parAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (ParAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
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
        int i = 0;
        String studentId = null;
        String projectName = null;
        try {
          studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          projectName = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          if (StringUtils.isBlank(studentId) || StringUtils.isBlank(projectName)) {
            errorAssess.put(projectName + Constant.DASH + studentId, Constant.INVALID_INPUT);
            continue;
          }
          String projectId = thesisProjectRepo.findProjectId(projectName);
          if (projectId == null) {
            errorAssess.put(projectName + Constant.DASH + studentId, Constant.NULL_PROJECT_ID);
            continue;
          }
          parAssessRepo.delete(surveyName, projectId, studentId);
          int size = Math.min(row.getPhysicalNumberOfCells(), idList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            ParAssess parAssess = new ParAssess(
                projectId, studentId, idList.get(i - titleCol), markLevelMap.get(answer), answer);
            jdbcAggregateTemplate.insert(parAssess);
          }
        } catch (Exception ex) {
          errorAssess.put(projectName + Constant.DASH + studentId, Constant.EXCEPTION);
          log.error("importAssess ERROR with studentId: {}, projectName: {}", studentId, projectName, ex);
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

  @PutMapping(value = "survey-indicator/{surveyIndicatorId}", produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional
  public ResponseEntity updateStudentId(@PathVariable("surveyName") String surveyName,
      @PathVariable("surveyIndicatorId") Integer surveyIndicatorId) {
    try {
      List<ParAssess> parAssesses = parAssessRepo.findBySurveyIndicatorId(surveyIndicatorId);
      for (int i = 0; i < parAssesses.size(); i++) {
        String sql = "UPDATE par_assess SET student_id = " + StringUtils.leftPad(String.valueOf(i + 1), 4, '0') + " WHERE id = ?";
        jdbcTemplate.update(sql, parAssesses.get(i).getId());
      }
    } catch (Exception ex) {
      log.error("updateStudentId ParAssess ERROR with exception: ", ex);
    }
    return ResponseEntity.ok(null);
  }
}
