package abet.cse.controller;

import abet.cse.dto.PagingResponse;
import abet.cse.model.ExtCourseIns;
import abet.cse.repository.CourseInsRepo;
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
@RequestMapping("course-instances")
@RequiredArgsConstructor
@Slf4j
public class CourseInsDirectController {

  private final CourseInsRepo courseInsRepo;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInstanceListDirect(
      @RequestParam(value = "programId", defaultValue = "") String programId,
      @RequestParam(value = "courseId", defaultValue = "") String courseId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "sortBy", defaultValue = "program_id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT a.id, name, credit, a.program_id, CONCAT(b.program_id, '-', b.year, '-', b.semester)"
          + " AS program_version_info FROM course_instance AS a LEFT JOIN program_instance AS b ON a.program_id = b.id"
          + " WHERE IFNULL(b.program_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<ExtCourseIns> extCourseInsList = jdbcTemplate.query(sql,
          ExtCourseIns.getRowMapper(), programId, courseId, name, pageSize, offset);
      long total = courseInsRepo.count(programId, courseId, name);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, extCourseInsList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getCourseInstanceListDirect SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseInstanceListDirect ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
