package abet.cse.controller.assess;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRowExtSupervisor;
import abet.cse.model.assess.DoProject;
import abet.cse.model.assess.SupAssess;
import abet.cse.model.assess.SupAssessExt;
import abet.cse.model.assess.SupAssessStat;
import abet.cse.model.assess.Supervise;
import abet.cse.repository.SurveyIndicatorRepo;
import abet.cse.repository.SurveyRepo;
import abet.cse.repository.ThesisProjectRepo;
import abet.cse.repository.assess.DoProjectRepo;
import abet.cse.repository.assess.SupAssessRepo;
import abet.cse.repository.assess.SuperviseRepo;
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
@RequestMapping("program-instances/{programInfo}/surveys/{surveyName}/supervisor-result")
@RequiredArgsConstructor
@Slf4j
public class SupAssessController {

  private final SurveyRepo surveyRepo;
  private final ThesisProjectRepo thesisProjectRepo;
  private final DoProjectRepo doProjectRepo;
  private final SuperviseRepo superviseRepo;
  private final SupAssessRepo supAssessRepo;
  private final SurveyIndicatorRepo surveyIndicatorRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyAnswer(@PathVariable("programInfo") String programInfo,
      @PathVariable("surveyName") String surveyName,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      List<Integer> superviseIdList = supAssessRepo.find(surveyName, pageSize, offset);

      List<String> indicatorNameList = surveyIndicatorRepo.find(surveyName);
      List<SupAssessExt> supAssessExtList = supAssessRepo.find(surveyName,
          superviseIdList.get(0), superviseIdList.get(superviseIdList.size() - 1));

      Map<Integer, Map<String, SupAssessExt>> superviseIdMap = new TreeMap<>();
      for (SupAssessExt supAssessExt : supAssessExtList) {
        Integer superviseId = supAssessExt.getSuperviseId();
        Map<String, SupAssessExt> indicatorMap = superviseIdMap.get(superviseId);
        if (indicatorMap == null) {
          indicatorMap = new HashMap<>();
          superviseIdMap.put(superviseId, indicatorMap);
        }
        indicatorMap.put(supAssessExt.getIndicatorName(), supAssessExt);
      }

      List<MatrixRowExtSupervisor> matrixRowList = new ArrayList<>();
      for (Map.Entry<Integer, Map<String, SupAssessExt>> entry : superviseIdMap.entrySet()) {
        MatrixRowExtSupervisor<SupAssess> matrixRow = new MatrixRowExtSupervisor<>();

        List<SupAssess> supAssessList = new ArrayList<>();
        String studentId = null, supervisor = null;
        for (String indicatorName : indicatorNameList) {
          SupAssessExt supAssessExt = entry.getValue().get(indicatorName);
          if (supAssessExt == null) supAssessExt = new SupAssessExt();
          supAssessList.add(supAssessExt);
          if (supAssessExt != null) {
            if (supervisor == null) supervisor = supAssessExt.getEmpId();
            if (studentId == null) studentId = supAssessExt.getStudentId();
          }
        }
        matrixRow.setTitle(studentId);
        matrixRow.setSupervisor(supervisor);
        matrixRow.setData(supAssessList);
        matrixRowList.add(matrixRow);
      }

      indicatorNameList.add(0, Constant.STUDENT_ID);
      indicatorNameList.add(0, Constant.SUPERVISOR);
      MatrixResponse matrixResponse = new MatrixResponse(indicatorNameList, matrixRowList);

      long total = supAssessRepo.count(surveyName);
      int lastPage = Utils.calculateLastPage(total, pageSize);
      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSurveyAnswer SUCCESS");
    } catch (Exception ex) {
      log.error("getSurveyAnswer ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyStat(@PathVariable("surveyName") String surveyName) {
    BaseResponse response;
    try {
      List<SupAssessStat> surveyExtList = supAssessRepo.find(surveyName);
      Boolean isLock = surveyRepo.isLock(surveyName);
      Map<String, Object> map = new HashMap<>();
      map.put("stat", surveyExtList);
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
      @RequestBody List<SupAssess> supAssessList) {
    BaseResponse response;
    List<SupAssess> errorAssessList = new ArrayList<>();
    try {
      List<SupAssessStat> assessStatList = supAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (SupAssessStat assessStat : assessStatList) {
        markLevelMap.put(assessStat.getMark(), assessStat.getLevel());
      }
      for (SupAssess supAssess : supAssessList) {
        try {
          Integer superviseId = supAssess.getSuperviseId();
          Integer surveyIndicatorId = supAssess.getSurveyIndicatorId();
          Long count = supAssessRepo.find(superviseId, surveyIndicatorId);
          supAssess.setLevel(markLevelMap.get(supAssess.getMark()));
          if (count > 0)
            supAssessRepo.update(superviseId, surveyIndicatorId, supAssess.getLevel(),
                supAssess.getMark());
          else
            jdbcAggregateTemplate.insert(supAssess);
        } catch (Exception ex) {
          log.error("postSurveyResult ERROR with [SupAssess] {}, exception: ",
              ObjectUtils.toJsonString(supAssess), ex);
          errorAssessList.add(supAssess);
        }
      }
    } catch (Exception ex) {
      errorAssessList = supAssessList;
      log.error("postSurveyResult ERROR with markLevelIdMap, exception: ", ex);
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
        : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("postSurveyResult SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{stat}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putSurveyStat(@PathVariable("surveyName") String surveyName,
      @RequestBody List<SupAssess> supAssessList) {
    BaseResponse response;
    List<SupAssess> errorAssessList = new ArrayList<>();
    for (SupAssess supAssess : supAssessList) {
      try {
        supAssessRepo.update(surveyName, supAssess.getMark(), supAssess.getLevel());
      } catch (Exception ex) {
        log.error("putSurveyStat ERROR with [SupAssess] {}, exception: ", ObjectUtils.toJsonString(supAssess), ex);
        errorAssessList.add(supAssess);
      }
    }
    response = errorAssessList.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
          : new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, errorAssessList);
    log.info("putSurveyStat SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteSurveyResult(@PathVariable("surveyName") String surveyName,
      @RequestBody SupAssess supAssess) {
    BaseResponse response;
    try {
      supAssessRepo.delete(surveyName, supAssess.getSuperviseId());
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
      List<SupAssessStat> assessStatList = supAssessRepo.find(surveyName);
      Map<String, Integer> markLevelMap = new HashMap<>();
      for (SupAssessStat assessStat : assessStatList) {
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
        String studentId = null;
        String empId = null;
        String projectName = null;
        try {
          empId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          projectName = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));
          if (StringUtils.isBlank(studentId) || StringUtils.isBlank(empId) || StringUtils.isBlank(projectName)) {
            errorAssess.put(empId + Constant.DASH + studentId + Constant.DASH + projectName, Constant.INVALID_INPUT);
            continue;
          }
          Integer superviseId = supAssessRepo.find(empId, studentId);
          if (superviseId == null) {
            String projectId = thesisProjectRepo.findProjectId(projectName);
            if (projectId == null) {
              errorAssess.put(empId + Constant.DASH + studentId + Constant.DASH + projectName, Constant.NULL_PROJECT_ID);
              continue;
            }
            Integer doProjectId = doProjectRepo.find(studentId, projectId);
            if (doProjectId == null) {
              DoProject doProject = new DoProject(studentId, projectId);
              doProjectId = doProjectRepo.save(doProject).getDoProjectId();
            }
            Supervise supervise = new Supervise(doProjectId, empId);
            superviseId = superviseRepo.save(supervise).getSuperviseId();
          }
          supAssessRepo.delete(surveyName, superviseId);
          int size = Math.min(row.getPhysicalNumberOfCells(), idList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            SupAssess supAssess = new SupAssess(
                superviseId, idList.get(i - titleCol), markLevelMap.get(answer), answer);
            jdbcAggregateTemplate.insert(supAssess);
          }
        } catch (Exception ex) {
          errorAssess.put(empId + Constant.DASH + studentId + Constant.DASH + projectName, Constant.EXCEPTION);
          log.error("importAssess ERROR with empId: {}, studentId: {}, projectName: {}", empId, studentId, projectName, ex);
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
