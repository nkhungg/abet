package abet.cse.controller.assess;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.model.assess.DoProject;
import abet.cse.model.assess.RevAssess;
import abet.cse.model.assess.RevAssessExt;
import abet.cse.model.assess.RevAssessStat;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.repository.SurveyRepo;
import abet.cse.repository.ThesisProjectRepo;
import abet.cse.repository.assess.DoProjectRepo;
import abet.cse.repository.assess.RevAssessRepo;
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
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/reviewer-result")
@RequiredArgsConstructor
@Slf4j
public class RevAssessController {

  private final SurveyRepo surveyRepo;
  private final ThesisProjectRepo thesisProjectRepo;
  private final DoProjectRepo doProjectRepo;
  private final RevAssessRepo revAssessRepo;
  private final SurveyIndicatorRepo surveyIndicatorRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyReviewerAnswer(@PathVariable("programInfo") String programInfo,
      @PathVariable("surveyName") String surveyName,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<Integer> doProjectIdList = revAssessRepo.find(surveyName, pageSize, offset);

      List<String> indicatorNameList = surveyIndicatorRepo.find(surveyName);
      List<RevAssessExt> revAssessExtList = revAssessRepo.find(surveyName,
          doProjectIdList.get(0), doProjectIdList.get(doProjectIdList.size() - 1));

      Map<String, Map<String, RevAssessExt>> studentIdMap = new TreeMap<>();
      for (RevAssessExt revAssessExt : revAssessExtList) {
        String studentId = revAssessExt.getStudentId();
        Map<String, RevAssessExt> indicatorMap = studentIdMap.get(studentId);
        if (indicatorMap == null) {
          indicatorMap = new HashMap<>();
          studentIdMap.put(studentId, indicatorMap);
        }
        indicatorMap.put(revAssessExt.getIndicatorName(), revAssessExt);
      }

      List<MatrixRow> matrixRowList = new ArrayList<>();
      for (Map.Entry<String, Map<String, RevAssessExt>> entry : studentIdMap.entrySet()) {
        MatrixRow<RevAssess> matrixRow = new MatrixRow<>();
        List<RevAssess> revAssessList = new ArrayList<>();
        for (String indicatorName : indicatorNameList) {
          RevAssessExt revAssessExt = entry.getValue().get(indicatorName);
          if (revAssessExt == null) revAssessExt = new RevAssessExt();
          revAssessList.add(revAssessExt);
        }
        matrixRow.setTitle(entry.getKey());
        matrixRow.setData(revAssessList);
        matrixRowList.add(matrixRow);
      }

      indicatorNameList.add(0, Constant.STUDENT_ID);
      MatrixResponse matrixResponse = new MatrixResponse(indicatorNameList, matrixRowList);

      long total = revAssessRepo.count(surveyName);
      int lastPage = Utils.calculateLastPage(total, pageSize);
      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSurveyReviewerAnswer SUCCESS");
    } catch (Exception ex) {
      log.error("getSurveyReviewerAnswer ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyStat(@PathVariable("surveyName") String surveyName) {
    BaseResponse response;
    try {
      List<RevAssessStat> revAssessStatList = revAssessRepo.find(surveyName);
      Boolean isLock = surveyRepo.isLock(surveyName);
      Map<String, Object> map = new HashMap<>();
      map.put("stat", revAssessStatList);
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
      @RequestBody List<RevAssess> revAssessList) {
    BaseResponse response;
    List<RevAssess> errorAssessList = new ArrayList<>();
    try {
      List<RevAssessStat> assessStatList = revAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (RevAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
      }
      for (RevAssess revAssess : revAssessList) {
        try {
          Integer doProjectId = revAssess.getDoProjectId();
          Integer surveyIndicatorId = revAssess.getSurveyIndicatorId();
          Long count = revAssessRepo.find(doProjectId, surveyIndicatorId);
          revAssess.setLevel(markLevelMap.get(revAssess.getMark()));
          if (count > 0)
            revAssessRepo.update(doProjectId, surveyIndicatorId, revAssess.getLevel(),
                revAssess.getMark());
          else
            jdbcAggregateTemplate.insert(revAssess);
        } catch (Exception ex) {
          log.error("postSurveyResult ERROR with [SupAssess] {}, exception: ",
              ObjectUtils.toJsonString(revAssess), ex);
          errorAssessList.add(revAssess);
        }
      }
    } catch (Exception ex) {
      errorAssessList = revAssessList;
      log.error("postSurveyResult ERROR with markLevelIdMap, exception: ", ex);
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("postSurveyResult SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyStat(@PathVariable("surveyName") String surveyName,
      @RequestBody List<RevAssess> revAssessList) {
    BaseResponse response;
    List<RevAssess> errorAssessList = new ArrayList<>();
    for (RevAssess revAssess : revAssessList) {
      try {
        revAssessRepo.update(surveyName, revAssess.getMark(), revAssess.getLevel());
      } catch (Exception ex) {
        log.error("putSurveyStat ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(revAssess), ex);
        errorAssessList.add(revAssess);
      }
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("putSurveyStat SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody RevAssess revAssess) {
    BaseResponse response;
    try {
      revAssessRepo.delete(surveyName, revAssess.getDoProjectId());
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
    int titleCol = 3;
    try {
      List<Integer> idList = surveyIndicatorRepo.findIdList(surveyName);
      List<RevAssessStat> assessStatList = revAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (RevAssessStat revAssessStat : assessStatList) {
        markLevelMap.put(revAssessStat.getMark(), revAssessStat.getLevel());
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
        String projectName = null;
        try {
          studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          projectName = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          if (StringUtils.isBlank(studentId) || StringUtils.isBlank(projectName)) {
            errorAssess.put(studentId + Constant.DASH + projectName, Constant.INVALID_INPUT);
            continue;
          }
          Integer doProjectId = doProjectRepo.findId(studentId, projectName);
          if (doProjectId == null) {
            String projectId = thesisProjectRepo.findProjectId(projectName);
            if (projectId == null) {
              errorAssess.put(studentId + Constant.DASH + projectName, Constant.NULL_PROJECT_ID);
              continue;
            }
            DoProject doProject = new DoProject(studentId, projectId);
            doProjectId = doProjectRepo.save(doProject).getDoProjectId();
          }
          revAssessRepo.delete(surveyName, doProjectId);
          int size = Math.min(row.getPhysicalNumberOfCells(), idList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            RevAssess revAssess = new RevAssess(
                doProjectId, idList.get(i - titleCol), markLevelMap.get(answer), answer);
            jdbcAggregateTemplate.insert(revAssess);
          }
        } catch (Exception ex) {
          errorAssess.put(studentId + Constant.DASH + projectName, Constant.EXCEPTION);
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
}
