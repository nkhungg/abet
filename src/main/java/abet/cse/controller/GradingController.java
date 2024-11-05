package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.model.Grading;
import abet.cse.model.GradingExt;
import abet.cse.model.QuestionCourseOutcome;
import abet.cse.repository.GradingRepo;
import abet.cse.repository.QuestionCourseOutcomeRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.FileUtil;
import abet.cse.utils.ObjectUtils;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("tests/{testId}/outcomes/{outcomeId}/grading")
@RequiredArgsConstructor
@Slf4j
public class GradingController {

  private final GradingRepo gradingRepo;
  private final QuestionCourseOutcomeRepo questionCourseOutcomeRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getGradingResult(@PathVariable("testId") String testId,
      @PathVariable("outcomeId") Integer outcomeId,
      @RequestParam(value = "classId", defaultValue = "") String classId) {
    BaseResponse response;
    try {
      List<GradingExt> gradingList = gradingRepo.find(classId, testId, outcomeId);

      List<MatrixRow> matrixRowList = new ArrayList<>();
      Map<String, String> questionMap = new HashMap<>();

      Map<String, Map<String, Grading>> gradingMap = new HashMap<>();
      for (GradingExt grading : gradingList) {
        Map<String, Grading> map = gradingMap.get(grading.getStudentId());
        if (map == null) {
          map = new HashMap<>();
          gradingMap.put(grading.getStudentId(), map);
        }
        map.put(grading.getQuestionId(), grading);
        questionMap.put(grading.getQuestionId(), grading.getQuestionName());
      }

      List<String> questionIdList = new ArrayList<>();
      List<String> questionNameList = new ArrayList<>();
      for (Map.Entry<String, String> entry : questionMap.entrySet()) {
        questionIdList.add(entry.getKey());
        questionNameList.add(entry.getValue());
      }

      for (Map.Entry<String, Map<String, Grading>> entry : gradingMap.entrySet()) {
        MatrixRow<Grading> matrixRow = new MatrixRow<>();

        List<Grading> gradingCellList = new ArrayList<>();
        for (String questionId : questionIdList) {
          Grading grading = entry.getValue().get(questionId);
          gradingCellList.add(grading);
        }

        matrixRow.setTitle(entry.getKey());
        matrixRow.setData(gradingCellList);
        matrixRowList.add(matrixRow);
      }

      questionNameList.add(0, Constant.STUDENT);
      MatrixResponse matrixResponse = new MatrixResponse(questionNameList, matrixRowList);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      log.info("getGradingResult SUCCESS with [BaseResponse] {}",
          ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getGradingResult ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postGrading(@PathVariable("testId") String testId,
      @RequestParam("file") MultipartFile multipartFile,
      @RequestParam(value = "sheet", defaultValue = "1") Integer sheetIdx,
      @RequestParam(value = "classId", defaultValue = "") String classId) {
    BaseResponse response;
    if (StringUtils.isBlank(classId)) {
      response = new BaseResponse(AbetCseStatusEnum.BLANK_CLASS_ID);
      return ResponseEntity.ok(ObjectUtils.toJsonString(response));
    }

    List<String> questionList = new ArrayList<>();
    // Is existed STT column
    boolean hasNoColumn = false;
    List<Grading> gradingList = new ArrayList<>();
    try {
      File file = FileUtil.convertMultiPartToFile(multipartFile);
      InputStream inputStream = new FileInputStream(file);
      XSSFWorkbook wb = new XSSFWorkbook(inputStream);
      XSSFSheet sheet = wb.getSheetAt(sheetIdx - 1);
      FormulaEvaluator formulaEvaluator = wb.getCreationHelper().createFormulaEvaluator();

      Map<String, Map<Integer, Float>> questionMap = new HashMap<>();
      List<QuestionCourseOutcome> questionCourseOutcomeList = questionCourseOutcomeRepo.find(testId);
      for (QuestionCourseOutcome questionCourseOutcome : questionCourseOutcomeList) {
        String questionId = questionCourseOutcome.getQuestionId();
        Map<Integer, Float> outcomeMap = questionMap.get(questionId);
        if (outcomeMap == null) {
          outcomeMap = new HashMap<>();
          questionMap.put(questionId, outcomeMap);
        }
        outcomeMap.put(questionCourseOutcome.getId(), questionCourseOutcome.getPercent());

        //-1 is id representing for entry with total
        Float total = outcomeMap.get(-1);
        if (total == null) total = 0f;
        outcomeMap.put(-1, total + questionCourseOutcome.getPercent());
      }

      for (Row row: sheet) {
        if (row.getPhysicalNumberOfCells() < 3) continue;
        Cell firstCell = row.getCell(0);

        if (formulaEvaluator.evaluateInCell(firstCell).getCellType().name().equalsIgnoreCase("STRING")
            && (firstCell.getStringCellValue().equalsIgnoreCase(Constant.NO_DOT)
            || firstCell.getStringCellValue().equalsIgnoreCase(Constant.NO)
            || firstCell.getStringCellValue().equalsIgnoreCase(Constant.STT))) {
          for (int i = 2; i < row.getPhysicalNumberOfCells(); i++) {
            String questionId = testId + Constant.DASH + row.getCell(i).getStringCellValue();
            questionList.add(questionId);
          }
          hasNoColumn = true;
          continue;
        }

        int i = hasNoColumn ? 1 : 0;
        String studentId = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i++));;
        if (StringUtils.isBlank(studentId)) continue;
        for (; i < row.getPhysicalNumberOfCells(); i++) {
          Double grade = row.getCell(i).getNumericCellValue();
          String questionId = questionList.get(i - 2);
          Map<Integer, Float> outcomeMap = questionMap.get(questionId);
          for (Map.Entry<Integer, Float> entry : outcomeMap.entrySet()) {
            if (entry.getKey() < 0) continue;
            Float outcomeGrade = grade.floatValue() * entry.getValue() / outcomeMap.get(-1);
            Grading grading = new Grading(studentId, classId, entry.getKey(), outcomeGrade);
            gradingList.add(grading);
          }
        }
      }
      for (Grading grading : gradingList) {
        try {
          jdbcAggregateTemplate.insert(grading);
        } catch (Exception ex) {
          log.error("postGrading ERROR with insert [Grading] {}, exception: ", ObjectUtils.toJsonString(grading), ex);
        }
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("postGrading SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postGrading ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    } finally {
      FileUtil.removeFile(multipartFile);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteGrading(@PathVariable("testId") String testId,
      @PathVariable("outcomeId") Integer outcomeId, @RequestBody GradingExt grading) {
    BaseResponse response;
    try {
      String sql = "DELETE FROM grading WHERE student_id = ? AND question_course_outcome_id IN"
          + " (SELECT id FROM question_course_outcome WHERE question_id = ?)";
      jdbcTemplate.update(sql, grading.getStudentId(), grading.getQuestionId());
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteGrading SUCCESS with testId: {}, outcomeId: {}", testId, outcomeId);
    } catch (Exception ex) {
      log.error("deleteGrading ERROR with testId: {}, outcomeId: {}, exception: ", testId, outcomeId, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
