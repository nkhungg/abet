package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.model.CourseIns;
import abet.cse.model.CourseInsOutcome;
import abet.cse.model.CourseInsOutline;
import abet.cse.model.CourseOutline;
import abet.cse.model.ExtCourseIns;
import abet.cse.model.ProgramIns;
import abet.cse.repository.CourseInsRepo;
import abet.cse.repository.CourseOutcomeRepo;
import abet.cse.repository.CourseOutlineRepo;
import abet.cse.repository.ProgramInsRepo;
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
import org.springframework.transaction.annotation.Transactional;
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
@RequestMapping("program-instances/{programInfo}/course-instances")
@RequiredArgsConstructor
@Slf4j
public class CourseInsController {

  private final CourseInsRepo courseInsRepo;
  private final CourseOutlineRepo courseOutlineRepo;
  private final CourseOutcomeRepo courseOutcomeRepo;
  private final ProgramInsRepo programInsRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInstanceList(@PathVariable("programInfo") String programInfo,
      @RequestParam(value = "courseId", defaultValue = "") String courseId,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);

      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      String programInstanceId = String.valueOf(programIns.getId());

      String sql = "SELECT * FROM course_instance WHERE IFNULL(id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND program_id = ?"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<CourseIns> courseInsList = jdbcTemplate.query(sql,
          CourseIns.getRowMapper(), courseId, name, programInstanceId, pageSize, offset);
      for (CourseIns courseIns : courseInsList) {
        courseIns.setProgramId(programIns.getProgramId());
      }

      long total = courseInsRepo.countByProgramIns(programInstanceId, courseId, name);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, courseInsList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getCourseInstanceList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseInstanceList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  @Transactional
  public ResponseEntity postCourseInstance(@PathVariable("programInfo") String programInfo,
      @RequestBody ExtCourseIns extCourseInstance) {
    BaseResponse response;
    try {
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      CourseIns persistedObject = courseInsRepo.findByProgramIdAndId(
          programIns.getId(), extCourseInstance.getCourseId());
      if (persistedObject != null) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      if (extCourseInstance.isOutlineChecked()) {
        CourseOutline courseOutline = courseOutlineRepo.findByProgramIdAndId(
            programIns.getProgramId(), extCourseInstance.getCourseId());
        CourseInsOutline courseInsOutline = new CourseInsOutline(programIns.getId(), courseOutline);
        jdbcAggregateTemplate.insert(courseInsOutline);
      } else {
        CourseIns courseIns = new CourseIns(extCourseInstance, programIns.getId());
        jdbcAggregateTemplate.insert(courseIns);
      }
      if (extCourseInstance.isOutcomeChecked()) {
        Utils.convertToOutcomeHierarchy(courseOutcomeRepo.findByProgramIdAndCourseId(
            programIns.getProgramId(), extCourseInstance.getCourseId()))
        .forEach(parent -> {
          CourseInsOutcome courseInsOutcome = new CourseInsOutcome(programIns.getId(), parent);
          jdbcAggregateTemplate.insert(courseInsOutcome);
          parent.getSecondary().forEach(child -> {
            CourseInsOutcome childCourseInsOutcome = new CourseInsOutcome(programIns.getId(), child, courseInsOutcome.getId());
            jdbcAggregateTemplate.insert(childCourseInsOutcome);
          });
        });
      }
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, extCourseInstance);
      log.info("postCourseInstance SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), extCourseInstance);
      log.error("postCourseInstance FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR, extCourseInstance);
      log.error("postCourseInstance ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putCourseInstance(@PathVariable("programInfo") String programInfo,
      @PathVariable("id") String id, @RequestBody CourseIns courseIns) {
    BaseResponse response;
    try {
      int programInstanceId = Utils.getProgramInstanceId(programInsRepo, programInfo).getId();
      CourseIns persistedObject = courseInsRepo.findByProgramIdAndId(programInstanceId, id);
      if (persistedObject == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      String sql = "UPDATE course_instance SET " + courseIns.toSql() + " WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, programInstanceId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseIns);
      log.info("putCourseInstance SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), courseIns);
      log.error("putCourseInstance FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
      log.error("putCourseInstance ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteCourseInstance(@PathVariable("programInfo") String programInfo,
      @PathVariable("id") String id) {
    BaseResponse response;
    try {
      int programInstanceId = Utils.getProgramInstanceId(programInsRepo, programInfo).getId();
      String sql = "DELETE FROM course_instance WHERE program_id = ? AND id = ?";
      jdbcTemplate.update(sql, programInstanceId, id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteCourseInstance SUCCESS with id: {}", id);
    } catch (Exception ex) {
      log.error("deleteCourseInstance ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
