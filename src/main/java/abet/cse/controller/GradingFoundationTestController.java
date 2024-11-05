package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.matrix.MatrixResponse;
import abet.cse.dto.matrix.MatrixRow;
import abet.cse.dto.matrix.QuestionStudentCell;
import abet.cse.model.GradingFoundationTest;
import abet.cse.model.GradingFoundationTestExt;
import abet.cse.repository.FoundationTestQuestionRepo;
import abet.cse.repository.GradingFoundationTestRepo;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("program-instances/{programInfo}/foundation-tests/{foundationTestId}/result")
@RequiredArgsConstructor
@Slf4j
public class GradingFoundationTestController {

  private final GradingFoundationTestRepo gradingFoundationTestRepo;
  private final FoundationTestQuestionRepo foundationTestQuestionRepo;
  private final JdbcTemplate jdbcTemplate;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getResult(@PathVariable("foundationTestId") String foundationTestId,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      List<String> studentList = gradingFoundationTestRepo.find(testId, pageSize, offset);
      List<String> questionList = foundationTestQuestionRepo.find(testId);
      List<GradingFoundationTestExt> gradingFoundationTestList = gradingFoundationTestRepo
          .find(testId, studentList.get(0), studentList.get(studentList.size() - 1));

      List<String> questionNameList = new ArrayList<>();
      List<String> answerList = new ArrayList<>();
      for (String question : questionList) {
        String[] array = question.split(Constant.HYPHEN);
        questionNameList.add(array[0]);
        answerList.add(array[1].trim());
      }

      Map<String, Map<String, String>> studentMap = new HashMap<>();
      for (GradingFoundationTestExt grading : gradingFoundationTestList) {
        Map<String, String> questionMap = studentMap.get(grading.getStudentId());
        if (questionMap == null) {
          questionMap = new HashMap<>();
          studentMap.put(grading.getStudentId(), questionMap);
        }
        questionMap.put(grading.getQuestionName(), grading.getResult());
      }

      List<MatrixRow> matrixRowList = new ArrayList<>();
      for (String student : studentList) {
        Map<String, String> questionMap = studentMap.get(student);
        List<QuestionStudentCell> questionStudentCellList = new ArrayList<>();
        for (String questionName : questionNameList) {
          QuestionStudentCell cell = new QuestionStudentCell(questionName, student, questionMap.get(questionName));
          questionStudentCellList.add(cell);
        }
        MatrixRow<QuestionStudentCell> matrixRow = new MatrixRow<>(student, questionStudentCellList);
        matrixRowList.add(matrixRow);
      }

      List<QuestionStudentCell> questionStudentCellList = new ArrayList<>();
      for (int i = 0; i < questionNameList.size(); i++) {
        QuestionStudentCell cell = new QuestionStudentCell(
            questionNameList.get(i), Constant.ANSWER, answerList.get(i));
        questionStudentCellList.add(cell);
      }
      MatrixRow<QuestionStudentCell> matrixRow = new MatrixRow<>(Constant.ANSWER, questionStudentCellList);
      matrixRowList.add(matrixRow);

      questionNameList.add(0, "Student Id");
      MatrixResponse matrixResponse = new MatrixResponse(questionNameList, matrixRowList);

      long total = gradingFoundationTestRepo.count(testId);
      int lastPage = Utils.calculateLastPage(total, pageSize);
      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, matrixResponse);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getResult SUCCESS with [foundationTestId] {}", foundationTestId);
    } catch (Exception ex) {
      log.error("getResult ERROR with [foundationTestId] {}, exception: ",
          foundationTestId, ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postResult(@PathVariable("foundationTestId") String foundationTestId,
      @RequestBody List<QuestionStudentCell> cellList) {
    BaseResponse response;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      for (QuestionStudentCell cell : cellList) {
        String sql = "UPDATE grading_foundation_test SET result = ? WHERE student_id = ? AND question_id = ?";
        jdbcTemplate.update(sql, cell.getAnswer(), cell.getStudentId(),
            testId + Constant.DASH + cell.getQuestionName());
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("postResult SUCCESS with [foundationTestId] {}, [BaseResponse] {}",
          foundationTestId, ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("postResult ERROR with [foundationTestId] {}, exception: ",
          foundationTestId, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(value = "{import}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity importFoundationTestGrading(@PathVariable("foundationTestId") String foundationTestId,
      @RequestParam(value = "sheet", defaultValue = "1") Integer sheetIdx,
      @RequestParam("file") MultipartFile multipartFile) {
    BaseResponse response;
    Map<String, String> errorAssess = new TreeMap<>();
    int titleCol = 2;
    try {
      String testId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
      List<String> questionIdList = foundationTestQuestionRepo.findId(testId);

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
          gradingFoundationTestRepo.delete(studentId, testId);
          int size = Math.min(row.getPhysicalNumberOfCells(), questionIdList.size() + titleCol);
          for (; i < size; i++) {
            String answer = FileUtil.getStringFromExcelCell(formulaEvaluator, row.getCell(i));
            GradingFoundationTest gradingFoundationTest = new GradingFoundationTest(null,
                studentId, testId, answer, questionIdList.get(i - titleCol));
            jdbcAggregateTemplate.insert(gradingFoundationTest);
          }
        } catch (Exception ex) {
          errorAssess.put(studentId, Constant.EXCEPTION);
          log.error("importFoundationTestGrading ERROR with studentId: {}", studentId, ex);
        }
      }
      response = errorAssess.size() == 0 ? new BaseResponse(AbetCseStatusEnum.REQUEST_OK)
          : new BaseResponse(AbetCseStatusEnum.IMPORT_FOUNDATION_TEST_GRADING_FAILED, ObjectUtils.toJsonString(errorAssess));
      log.info("importFoundationTestGrading SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("importFoundationTestGrading ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, ObjectUtils.toJsonString(errorAssess));
    } finally {
      FileUtil.removeFile(multipartFile);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
