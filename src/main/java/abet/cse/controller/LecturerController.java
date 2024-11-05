package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Lecturer;
import abet.cse.repository.LecturerRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("lecturers")
@RequiredArgsConstructor
@Slf4j
public class LecturerController {

  private final LecturerRepo lecturerRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getLecturerList(
      @RequestParam(value = "id", defaultValue = "") String id,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "faculty", defaultValue = "") String faculty,
      @RequestParam(value = "email", defaultValue = "") String email,
      @RequestParam(value = "department", defaultValue = "") String department,
      @RequestParam(value = "phoneNumber", defaultValue = "") String phoneNumber,
      @RequestParam(value = "contactLevel", defaultValue = "") String contactLevel,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM lecturer where IFNULL(id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(faculty, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(email, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(department, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(phone_number, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(contact_level, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<Lecturer> lecturerList = jdbcTemplate.query(sql,
          Lecturer.getRowMapper(), id, name, faculty, email, department, phoneNumber, contactLevel, pageSize, offset);
      long total = lecturerRepo.count(id, name, faculty, email, department, phoneNumber, contactLevel);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, lecturerList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getLecturerList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getLecturerList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postLecturer(@RequestBody Lecturer lecturer) {
    BaseResponse response;
    try {
      boolean isExisted = lecturerRepo.existsById(lecturer.getId());
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(lecturer);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, lecturer);
      log.info("postLecturer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), lecturer);
      log.error("postLecturer FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postLecturer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putLecturer(@PathVariable("id") String id, @RequestBody Lecturer lecturer) {
    BaseResponse response;
    try {
      boolean isExisted = lecturerRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      lecturer.setId(id);
      lecturerRepo.save(lecturer);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, lecturer);
      log.info("putLecturer SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), lecturer);
      log.error("putLecturer FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putLecturer ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteLecturer(@PathVariable("id") String id) {
    BaseResponse response;
    try {
      lecturerRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteLecturer SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteLecturer ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
