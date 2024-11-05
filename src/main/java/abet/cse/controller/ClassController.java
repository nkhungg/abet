package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Class;
import abet.cse.model.ClassExt;
import abet.cse.model.ProgramIns;
import abet.cse.repository.ClassRepo;
import abet.cse.repository.CourseInsClassStudentRepo;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
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
@RequestMapping("program-instances/{programInfo}/course-instances/{courseInsId}/classes")
@RequiredArgsConstructor
@Slf4j
public class ClassController {

  private final ClassRepo classRepo;
  private final ProgramInsRepo programInsRepo;
  private final CourseInsClassStudentRepo courseInsClassStudentRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getClassList(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseInsId") String courseInsId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "lecturerId", defaultValue = "") String lecturerId,
      @RequestParam(value = "lecturerName", defaultValue = "") String lecturerName,
      @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      int programInstanceId = programIns.getId();
      String sql = "SELECT a.*, b.name AS lecturer_name FROM class AS a LEFT JOIN lecturer AS b"
          + " ON a.lecturer_id = b.id WHERE a.program_id = ? AND a.course_instance_id = ?"
          + " AND IFNULL(a.name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(a.lecturer_id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(b.name, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<ClassExt> classList = jdbcTemplate.query(sql, ClassExt.getRowMapper(), programInstanceId,
          courseInsId, name, lecturerId, lecturerName, pageSize, offset);
      for (ClassExt element : classList) {
        int studentAmount = courseInsClassStudentRepo.countByClassId(element.getId());
        element.setStudentAmount(studentAmount);
      }

      long total = classRepo.count(programInstanceId, courseInsId, name, lecturerId, lecturerName);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, classList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getClassList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getClassList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postClass(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseInsId") String courseInsId, @RequestBody Class classModel) {
    BaseResponse response;
    try {
      String id = programInfo.replaceAll(Constant.HYPHEN, Constant.DASH) + Constant.DASH +
          courseInsId + Constant.DASH + classModel.getName();
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      boolean isExisted = classRepo.existsById(id);
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      classModel.setId(id);
      classModel.setCourseInstanceId(courseInsId);
      classModel.setProgramInstanceId(programIns.getId());
      jdbcAggregateTemplate.insert(classModel);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, classModel);
      log.info("postClass SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), classModel);
      log.error("postClass FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("postClass ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putClass(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseInsId") String courseInsId, @PathVariable("id") String id, @RequestBody Class classModel) {
    BaseResponse response;
    try {
      boolean isExisted = classRepo.existsById(id);
      if (!isExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE class SET " + classModel.toSql() + " WHERE id = ?";
      jdbcTemplate.update(sql, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, classModel);
      log.info("putClass SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), classModel);
      log.error("putClass FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("putClass ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteClass(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseInsId") String courseInsId, @PathVariable("id") String id) {
    BaseResponse response;
    try {
      classRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteClass SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteClass ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
