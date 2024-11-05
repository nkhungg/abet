package abet.cse.controller.assess;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRowExt;
import abet.cse.model.assess.CommitAssess;
import abet.cse.model.assess.CommitAssessExt;
import abet.cse.model.assess.CommitAssessStat;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.repository.SurveyRepo;
import abet.cse.repository.ThesisProjectRepo;
import abet.cse.repository.assess.CommitAssessRepo;
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
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/committee-result")
@RequiredArgsConstructor
@Slf4j
public class CommitAssessController {

  private final SurveyRepo surveyRepo;
  private final ThesisProjectRepo thesisProjectRepo;
  private final CommitAssessRepo commitAssessRepo;
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
      List<String> lecturerStudentList = commitAssessRepo.find(surveyName, pageSize, offset);
      List<String> indicatorNameList = surveyIndicatorRepo.find(surveyName);

      List<CommitAssessExt> commitAssessExtList = new ArrayList<>();
      if (lecturerStudentList.size() > 0) {
        commitAssessExtList = commitAssessRepo.find(surveyName, lecturerStudentList.get(0),
            lecturerStudentList.get(lecturerStudentList.size() - 1));
      }

      Map<String, Map<String, CommitAssessExt>> studentIdMap = new TreeMap<>();
      for (CommitAssessExt commitAssessExt : commitAssessExtList) {
        String studentId = commitAssessExt.getLecturerId() + Constant.DASH + commitAssessExt.getStudentId();
        Map<String, CommitAssessExt> indicatorMap = studentIdMap.get(studentId);
        if (indicatorMap == null) {
          indicatorMap = new HashMap<>();
          studentIdMap.put(studentId, indicatorMap);
        }
        indicatorMap.put(commitAssessExt.getIndicatorName(), commitAssessExt);
      }

      List<MatrixRowExt> matrixRowList = new ArrayList<>();
      for (Map.Entry<String, Map<String, CommitAssessExt>> entry : studentIdMap.entrySet()) {
        MatrixRowExt<CommitAssessExt> matrixRow = new MatrixRowExt<>();
        List<CommitAssessExt> commitAssessList = new ArrayList<>();
        for (String indicatorName : indicatorNameList) {
          CommitAssessExt commitAssessExt = entry.getValue().get(indicatorName);
          if (commitAssessExt == null) commitAssessExt = new CommitAssessExt();
          commitAssessList.add(commitAssessExt);
        }
        String[] arr = entry.getKey().split(Constant.DASH);
        matrixRow.setTitle(arr[0]);
        matrixRow.setSubTitle(arr[1]);
        matrixRow.setData(commitAssessList);
        matrixRowList.add(matrixRow);
      }

      indicatorNameList.add(0, Constant.STUDENT_ID);
      indicatorNameList.add(0, Constant.LECTURER_ID);
      MatrixResponse matrixResponse = new MatrixResponse(indicatorNameList, matrixRowList);

      long total = commitAssessRepo.count(surveyName);
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
      List<CommitAssessStat> commitAssessStatList = commitAssessRepo.find(surveyName);
      Boolean isLock = surveyRepo.isLock(surveyName);
      Map<String, Object> map = new HashMap<>();
      map.put("stat", commitAssessStatList);
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
      @RequestBody List<CommitAssess> commitAssessList) {
    BaseResponse response;
    List<CommitAssess> errorAssessList = new ArrayList<>();
    try {
      List<CommitAssessStat> assessStatList = commitAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (CommitAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
      }
      for (CommitAssess commitAssess : commitAssessList) {
        try {
          String lecturerId = commitAssess.getLecturerId();
          String studentId = commitAssess.getStudentId();
          Integer surveyIndicatorId = commitAssess.getSurveyIndicatorId();
          commitAssess.setLevel(markLevelMap.get(commitAssess.getMark()));
          Integer count = commitAssessRepo.count(lecturerId, studentId, surveyIndicatorId);
          if (count > 0) {
            commitAssessRepo.update(lecturerId, studentId, surveyIndicatorId,
                commitAssess.getLevel(), commitAssess.getMark());
          } else {
            jdbcAggregateTemplate.insert(commitAssess);
          }
        } catch (Exception ex) {
          log.error("postSurveyResult ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(commitAssess), ex);
          errorAssessList.add(commitAssess);
        }
      }
    } catch (Exception ex) {
      errorAssessList = commitAssessList;
      log.error("postSurveyResult ERROR with markLevelIdMap, exception: ", ex);
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("postSurveyResult SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyStat(@PathVariable("surveyName") String surveyName,
      @RequestBody List<CommitAssess> commitAssessList) {
    BaseResponse response;
    List<CommitAssess> errorAssessList = new ArrayList<>();
    for (CommitAssess commitAssess : commitAssessList) {
      try {
        commitAssessRepo.update(surveyName, commitAssess.getMark(), commitAssess.getLevel());
      } catch (Exception ex) {
        log.error("putSurveyStat ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(commitAssess), ex);
        errorAssessList.add(commitAssess);
      }
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("putSurveyStat SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody CommitAssess commitAssess) {
    BaseResponse response;
    try {
      commitAssessRepo.delete(surveyName, commitAssess.getLecturerId(), commitAssess.getStudentId());
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
      List<CommitAssessStat> assessStatList = commitAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (CommitAssessStat assessStat : assessStatList) {
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
        int i = 1;
        String lecturerId = null;
        String studentId = null;
        String projectName = null;
        try {
          lecturerId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          projectName = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          if (StringUtils.isBlank(lecturerId) || StringUtils.isBlank(studentId) || StringUtils.isBlank(projectName)) {
            errorAssess.put(lecturerId + Constant.DASH + studentId + Constant.DASH + projectName, Constant.INVALID_INPUT);
            continue;
          }
          String projectId = thesisProjectRepo.findProjectId(projectName);
          if (projectId == null) {
            errorAssess.put(lecturerId + Constant.DASH + studentId + Constant.DASH + projectName, Constant.NULL_PROJECT_ID);
            continue;
          }
          commitAssessRepo.delete(surveyName, lecturerId, studentId);
          int size = Math.min(row.getPhysicalNumberOfCells(), idList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            CommitAssess commitAssess = new CommitAssess(lecturerId, studentId, projectId,
                idList.get(i - titleCol), markLevelMap.get(answer), answer);
            jdbcAggregateTemplate.insert(commitAssess);
          }
        } catch (Exception ex) {
          errorAssess.put(lecturerId + Constant.DASH + studentId + Constant.DASH + projectName, Constant.EXCEPTION);
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
