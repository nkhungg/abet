package abet.cse.controller.assess;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRowExt;
import abet.cse.model.assess.CeHdAssess;
import abet.cse.model.assess.CeHdAssessExt;
import abet.cse.model.assess.CeHdAssessStat;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.repository.SurveyRepo;
import abet.cse.repository.assess.CeHdAssessRepo;
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
@RequestMapping(value = {"api/program-instances/{programInfo}/surveys/{surveyName}/ce-hd-result",
    "api/program-instances/{programInfo}/surveys/{surveyName}/ce-supervisor-result"})
@RequiredArgsConstructor
@Slf4j
public class CeHdAssessController {

  private final SurveyRepo surveyRepo;
  private final CeHdAssessRepo ceHdAssessRepo;
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
      List<String> lecturerStudentList = ceHdAssessRepo.find(surveyName, pageSize, offset);
      List<String> indicatorNameList = surveyIndicatorRepo.find(surveyName);
      List<CeHdAssessExt> ceHdAssessExtList = new ArrayList<>();
      if (lecturerStudentList.size() > 0) {
        ceHdAssessExtList = ceHdAssessRepo.find(surveyName, lecturerStudentList.get(0),
            lecturerStudentList.get(lecturerStudentList.size() - 1));
      }

      Map<String, Map<String, CeHdAssessExt>> studentIdMap = new TreeMap<>();
      for (CeHdAssessExt ceHdAssessExt : ceHdAssessExtList) {
        String studentId = ceHdAssessExt.getLecturerId() + Constant.DASH + ceHdAssessExt.getStudentId();
        Map<String, CeHdAssessExt> indicatorMap = studentIdMap.get(studentId);
        if (indicatorMap == null) {
          indicatorMap = new HashMap<>();
          studentIdMap.put(studentId, indicatorMap);
        }
        indicatorMap.put(ceHdAssessExt.getIndicatorName(), ceHdAssessExt);
      }

      List<MatrixRowExt> matrixRowList = new ArrayList<>();
      for (Map.Entry<String, Map<String, CeHdAssessExt>> entry : studentIdMap.entrySet()) {
        MatrixRowExt<CeHdAssessExt> matrixRow = new MatrixRowExt<>();
        List<CeHdAssessExt> ceHdAssessList = new ArrayList<>();
        for (String indicatorName : indicatorNameList) {
          CeHdAssessExt ceHdAssessExt = entry.getValue().get(indicatorName);
          if (ceHdAssessExt == null) ceHdAssessExt = new CeHdAssessExt();
          ceHdAssessList.add(ceHdAssessExt);
        }
        String[] arr = entry.getKey().split(Constant.DASH);
        matrixRow.setTitle(arr[0]);
        matrixRow.setSubTitle(arr[1]);
        matrixRow.setData(ceHdAssessList);
        matrixRowList.add(matrixRow);
      }

      indicatorNameList.add(0, Constant.LECTURER_ID);
      indicatorNameList.add(1, Constant.STUDENT_ID);
      MatrixResponse matrixResponse = new MatrixResponse(indicatorNameList, matrixRowList);

      long total = ceHdAssessRepo.count(surveyName);
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
      List<CeHdAssessStat> ceHdAssessStatList = ceHdAssessRepo.find(surveyName);
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
      @RequestBody List<CeHdAssess> ceHdAssessList) {
    BaseResponse response;
    List<CeHdAssess> errorAssessList = new ArrayList<>();
    try {
      List<CeHdAssessStat> assessStatList = ceHdAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (CeHdAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
      }
      for (CeHdAssess ceHdAssess : ceHdAssessList) {
        try {
          String lecturerId = ceHdAssess.getLecturerId();
          String studentId = ceHdAssess.getStudentId();
          Integer surveyIndicatorId = ceHdAssess.getSurveyIndicatorId();
          ceHdAssess.setLevel(markLevelMap.get(ceHdAssess.getMark()));
          Integer count = ceHdAssessRepo.count(lecturerId, studentId, surveyIndicatorId);
          if (count > 0) {
            ceHdAssessRepo.update(lecturerId, studentId, surveyIndicatorId,
                ceHdAssess.getLevel(), ceHdAssess.getMark());
          } else {
            jdbcAggregateTemplate.insert(ceHdAssess);
          }
        } catch (Exception ex) {
          log.error("postSurveyResult ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(ceHdAssess), ex);
          errorAssessList.add(ceHdAssess);
        }
      }
    } catch (Exception ex) {
      errorAssessList = ceHdAssessList;
      log.error("postSurveyResult ERROR with markLevelIdMap, exception: ", ex);
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("postSurveyResult SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyStat(@PathVariable("surveyName") String surveyName,
      @RequestBody List<CeHdAssess> ceHdAssessList) {
    BaseResponse response;
    List<CeHdAssess> errorAssessList = new ArrayList<>();
    for (CeHdAssess ceHdAssess : ceHdAssessList) {
      try {
        ceHdAssessRepo.update(surveyName, ceHdAssess.getMark(), ceHdAssess.getLevel());
      } catch (Exception ex) {
        log.error("putSurveyStat ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(ceHdAssess), ex);
        errorAssessList.add(ceHdAssess);
      }
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("putSurveyStat SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody CeHdAssess ceHdAssess) {
    BaseResponse response;
    try {
      ceHdAssessRepo.delete(surveyName, ceHdAssess.getLecturerId(), ceHdAssess.getStudentId());
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
      List<CeHdAssessStat> assessStatList = ceHdAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (CeHdAssessStat ceHdAssessStat : assessStatList) {
        markLevelMap.put(ceHdAssessStat.getMark(), ceHdAssessStat.getLevel());
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
        String lecturerId = null;
        String studentId = null;
        try {
          lecturerId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          if (StringUtils.isBlank(lecturerId) || StringUtils.isBlank(studentId)) {
            errorAssess.put(lecturerId + Constant.DASH + studentId, Constant.INVALID_INPUT);
            continue;
          }
          ceHdAssessRepo.delete(surveyName, lecturerId, studentId);
          int size = Math.min(row.getPhysicalNumberOfCells(), idList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            CeHdAssess ceHdAssess = new CeHdAssess(lecturerId, studentId,
                idList.get(i - titleCol), markLevelMap.get(answer), answer);
            jdbcAggregateTemplate.insert(ceHdAssess);
          }
        } catch (Exception ex) {
          errorAssess.put(lecturerId + Constant.DASH + studentId, Constant.EXCEPTION);
          log.error("importAssess ERROR with lecturerId: {}, studentId: {}", lecturerId, studentId, ex);
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
