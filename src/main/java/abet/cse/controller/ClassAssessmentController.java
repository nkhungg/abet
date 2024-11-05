package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.ClassAssessment;
import abet.cse.repository.ClassAssessmentRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("classes/{classId}/assessment")
@RequiredArgsConstructor
@Slf4j
public class ClassAssessmentController {

  private final ClassAssessmentRepo classAssessmentRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getClassAssessmentList(@PathVariable("classId") String classId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "cdio", defaultValue = "") String cdio,
      @RequestParam(value = "threshold", defaultValue = "") String threshold,
      @RequestParam(value = "classThreshold", defaultValue = "") String classThreshold,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT class_id, course_outcome_instance_id, a.threshold AS class_threshold, b.name, b.description, cdio, b.threshold"
          + " FROM class_assess AS a LEFT JOIN course_outcome_instance AS b"
          + " ON a.course_outcome_instance_id = b.id"
          + " WHERE a.class_id = ? AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(cdio, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.threshold, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.threshold, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<ClassAssessment> classAssessmentList = jdbcTemplate.query(sql, ClassAssessment.getRowMapper(),
          classId, name, description, cdio, threshold, classThreshold, pageSize, offset);
      long total = classAssessmentRepo.count(classId, name, description, cdio, threshold, classThreshold);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, classAssessmentList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getClassAssessmentList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getClassAssessmentList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{outcomeInsId}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putClassAssessment(@PathVariable("classId") String classId,
       @PathVariable("outcomeInsId") Integer outcomeInsId, @RequestBody ClassAssessment classAssessment) {
    BaseResponse response;
    try {
      int count = classAssessmentRepo.countByClassIdAndOutcomeInsId(classId, outcomeInsId);
      if (count == 0) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE class_assess SET " + classAssessment.toSql() + " WHERE class_id = ? AND course_outcome_instance_id = ?";
      jdbcTemplate.update(sql, classId, outcomeInsId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, classAssessment);
      log.info("putClassAssessment SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), classAssessment);
      log.error("putClassAssessment FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putClassAssessment ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
