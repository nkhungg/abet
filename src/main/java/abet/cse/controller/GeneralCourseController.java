package abet.cse.controller;

import abet.cse.dto.AbetCseException;
import abet.cse.dto.BaseResponse;
import abet.cse.dto.CourseDetailsResponse;
import abet.cse.dto.PagingResponse;
import abet.cse.dto.attribute.AttrSelectedResponse;
import abet.cse.model.AttrOptionModel;
import abet.cse.model.AttributeModel;
import abet.cse.model.GeneralCourse;
import abet.cse.model.GeneralCourseAttr;
import abet.cse.repository.AttrOptionRepo;
import abet.cse.repository.AttributeRepo;
import abet.cse.repository.GeneralCourseRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.statics.Constant;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import abet.cse.validator.Validator;
import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("general-courses")
@RequiredArgsConstructor
@Slf4j
public class GeneralCourseController {

  private final GeneralCourseRepo generalCourseRepo;
  private final AttributeRepo attributeRepo;
  private final AttrOptionRepo attrOptionRepo;
  private final JdbcAggregateTemplate jdbcAggregateTemplate;
  private final JdbcTemplate jdbcTemplate;

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getGeneralCourseList(
      @RequestParam(value = "id", defaultValue = "") String id,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "groups", defaultValue = "") String groups,
      @RequestParam(value = "description", defaultValue = "") String description,
      @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
      @RequestParam(value = "orderBy", defaultValue = "ASC") String orderBy,
      @RequestParam(value = "currentPage", defaultValue = "1") int currentPage,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    PagingResponse response;
    try {
      int offset = pageSize * (currentPage - 1);
      String sql = "SELECT * FROM general_course where IFNULL(id, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(name, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(groups, '') LIKE CONCAT('%',?,'%')"
          + " AND IFNULL(description, '') LIKE CONCAT('%',?,'%')"
          + Utils.getOrderPagingSql(sortBy, orderBy);
      List<GeneralCourse> courseList = jdbcTemplate.query(sql,
          GeneralCourse.getRowMapper(), id, name, groups, description, pageSize, offset);
      long total = generalCourseRepo.count(id, name, groups, description);
      int lastPage = Utils.calculateLastPage(total, pageSize);

      response = new PagingResponse(AbetCseStatusEnum.REQUEST_OK, courseList);
      response.setPage(total, currentPage, lastPage, pageSize);
      log.info("getGeneralCourseList SUCCESS with [PagingResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getGeneralCourseList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getGeneralCourseDetails(@PathVariable("id") String id) {
    BaseResponse response;
    try {
      GeneralCourse generalCourse = generalCourseRepo.findById(id).orElse(null);
      if (generalCourse == null) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);

      CourseDetailsResponse courseDetailsResponse = new CourseDetailsResponse(generalCourse, null);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseDetailsResponse);
      log.info("getGeneralCourseDetails SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));

    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum());
      log.error("getGeneralCourseDetails FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      log.error("getGeneralCourseDetails ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity postgeneralCourse(GeneralCourse generalCourse, int[] attrIdList, String[] valueList) {
    BaseResponse response;
    try {
      if (attrIdList == null) attrIdList = new int[0];
      if (valueList == null) valueList = new String[0];
      boolean isValid = Validator.validateAttr(attrIdList, valueList);
      if (!isValid) throw new AbetCseException(AbetCseStatusEnum.INVALID_LIST);

      boolean isExisted = generalCourseRepo.existsById(generalCourse.getId());
      if (isExisted) throw new AbetCseException(AbetCseStatusEnum.DUPLICATED_ENTITY);

      jdbcAggregateTemplate.insert(generalCourse);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, generalCourse);
      log.info("postgeneralCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), generalCourse);
      log.error("postgeneralCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
      log.error("postgeneralCourse ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PutMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity putGeneralCourse(@PathVariable("id") String id,
      GeneralCourse generalCourse, int[] attrIdList, String[] valueList) {
    BaseResponse response;
    try {
      if (attrIdList == null) attrIdList = new int[0];
      if (valueList == null) valueList = new String[0];
      boolean isValid = Validator.validateAttr(attrIdList, valueList);
      if (!isValid) throw new AbetCseException(AbetCseStatusEnum.INVALID_LIST);

      boolean isCourseExisted = generalCourseRepo.existsById(id);
      if (!isCourseExisted) throw new AbetCseException(AbetCseStatusEnum.ENTITY_NOT_EXISTED);
      generalCourseRepo.save(generalCourse);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, generalCourse);
      log.info("putGeneralCourse SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (AbetCseException ex) {
      response = new BaseResponse(ex.getStatusEnum(), generalCourse);
      log.error("putGeneralCourse FAIL with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
      log.error("putGeneralCourse ERROR with [BaseResponse] {}, exception: ", ObjectUtils.toJsonString(response), ex);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @DeleteMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity deleteGeneralCourse(@PathVariable("id") String id) {
    BaseResponse response;
    try {
      generalCourseRepo.deleteById(id);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK);
      log.info("deleteGeneralCourse SUCCESS with courseId: {}", id);
    } catch (Exception ex) {
      log.error("deleteGeneralCourse ERROR with id: {}, exception: ", id, ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
