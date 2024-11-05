package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Student;
import abet.cse.repository.CourseInsClassStudentRepo;
import abet.cse.repository.StudentRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("students")
@RequiredArgsConstructor
@Slf4j
public class StudentController {

  private final StudentRepo studentRepo;
  private final CourseInsClassStudentRepo courseInsClassStudentRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getStudentList(
      @RequestParam(value = "id", defaultValue = "") String id,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "major", defaultValue = "") String major,
      @RequestParam(value = "year", defaultValue = "") String year,
      @RequestParam(value = "email", defaultValue = "") String email,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
      @RequestParam(value = "classIdPrefix", defaultValue = "") String classIdPrefix) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM student where IFNULL(id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(major, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(year, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(email, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Student> studentList = jdbcTemplate.query(sql,
          Student.getRowMapper(), id, name, major, year, email, pageSize, offset);
      long total = -1L;
      int lastPage = -1;
      if (StringUtils.isNotBlank(classIdPrefix)) {
        Set<String> excludedStudentIds = courseInsClassStudentRepo.findStudentId(classIdPrefix);
        studentList = studentList.stream()
            .filter(student -> !excludedStudentIds.contains(student.getId()))
            .collect(Collectors.toList());
      } else {
        total = studentRepo.count(id, name, major, year, email);
        lastPage = Utils.calculateLastPage(total, pageSize);
      }

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, studentList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getStudentList SUCCESS with [StudentListResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getStudentList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postStudent(@RequestBody Student student) {
    BaseResponse response;
    try {
      boolean isExisted = studentRepo.existsById(student.getId());
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(student);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, student);
      log.info("postStudent SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), student);
      log.error("postStudent FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postStudent ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putStudent(@PathVariable("id") String id, @RequestBody Student student) {
    BaseResponse response;
    try {
      boolean isExisted = studentRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      student.setId(id);
      studentRepo.save(student);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, student);
      log.info("putStudent SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), student);
      log.error("putStudent FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putStudent ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteStudent(@PathVariable("id") String id) {
    BaseResponse response;
    try {
      studentRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteStudent SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteStudent ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "majors", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getMajorList() {
    BaseResponse response;
    try {
      List<String> majorList = studentRepo.findMajor();
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, majorList);
      log.info("getMajorList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getMajorList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "years", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getYearList() {
    BaseResponse response;
    try {
      List<Integer> yearList = studentRepo.findYear();
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, yearList);
      log.info("getMajorList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getMajorList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
