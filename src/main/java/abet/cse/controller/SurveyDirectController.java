package abet.cse.controller;

import abet.cse.dto.PagingResponse;
import abet.cse.model.SurveyExt;
import abet.cse.repository.SurveyRepo;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("surveys")
@RequiredArgsConstructor
@Slf4j
public class SurveyDirectController {

  private final SurveyRepo surveyRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyListDirect(
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "surveyKindName", defaultValue = "") String surveyKindName,
      @RequestParam(value = "surveyTypeName", defaultValue = "") String surveyTypeName,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT a.*, b.name AS survey_type_name, CONCAT(c.program_id, '-', c.year, '-', c.semester)"
          + " AS program_version_info FROM survey AS a LEFT JOIN survey_type AS b ON a.type = b.id"
          + " LEFT JOIN program_instance AS c ON a.program_instance_id = c.id"
          + " WHERE IFNULL(a.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.description, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.survey_kind_name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<SurveyExt> surveyExtList = jdbcTemplate.query(sql,
          SurveyExt.getRowMapper(), name, description, surveyKindName, surveyTypeName, pageSize, offset);
      long total = surveyRepo.count(name, description, surveyKindName, surveyTypeName);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, surveyExtList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getSurveyListDirect SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSurveyListDirect ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
