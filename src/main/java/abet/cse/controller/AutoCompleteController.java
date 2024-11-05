package abet.cse.controller;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.CourseInsOutcomeExtend;
import abet.cse.dto.CourseOutcomeExtend;
import abet.cse.dto.PagingResponse;
import abet.cse.model.Course;
import abet.cse.model.CourseInsOutcome;
import abet.cse.model.CourseOutcome;
import abet.cse.model.Level;
import abet.cse.model.ProgramIns;
import abet.cse.repository.CourseInsOutcomeRepo;
import abet.cse.repository.CourseOutcomeRepo;
import abet.cse.repository.CourseRepo;
import abet.cse.repository.GeneralCourseRepo;
import abet.cse.repository.IndicatorRepo;
import abet.cse.repository.LevelRepo;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.repository.ProgramRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.utils.Utils;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
@Slf4j
public class AutoCompleteController {

  private final GeneralCourseRepo generalCourseRepo;
  private final IndicatorRepo indicatorRepo;
  private final CourseOutcomeRepo courseOutcomeRepo;
  private final CourseInsOutcomeRepo courseInsOutcomeRepo;
  private final CourseInsOutcomeRepo courseInstanceOutcomeRepo;
  private final CourseRepo courseRepo;
  private final ProgramRepo programRepo;
  private final ProgramInsRepo programInsRepo;
  private final LevelRepo levelRepo;

  @GetMapping(value = "general-courses/ids", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getGeneralCourseIdAndNameList() {
    BaseResponse response;
    try {
      List<String> generalCourseIdNameList = generalCourseRepo.findIdAndName();
      List<Map<String, Object>> mapList = Utils.toMapList(generalCourseIdNameList);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, mapList);
      log.info("getGeneralCourseIdAndNameList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getGeneralCourseIdAndNameList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "programs/ids", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getProgramIdList() {
    BaseResponse response;
    try {
      List<String> programIdList = programRepo.findId();
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, programIdList);
      log.info("getProgramIdList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getProgramIdList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "indicators/names", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getIndicatorNameList(@RequestParam("programId") String programId) {
    BaseResponse response;
    try {
      List<String> indicatorNameList = indicatorRepo.findNameByProgramId(programId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, indicatorNameList);
      log.info("getIndicatorNameList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getIndicatorNameList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "course-outcomes/names", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseOutcomeNameList(@RequestParam("programId") String programId,
      @RequestParam("courseId") String courseId) {
    BaseResponse response;
    try {
      List<CourseOutcome> courseOutcomeList = courseOutcomeRepo.findColumnByProgramIdAndCourseId(programId, courseId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseOutcomeList);
      log.info("getCourseOutcomeNameList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseOutcomeNameList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "program-instances/program-info", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getProgramInfoList() {
    BaseResponse response;
    try {
      List<String> programInfoList = programInsRepo.findProgramInfo();
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, programInfoList);
      log.info("getProgramInfoList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getProgramInfoList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "course-instance-outcomes", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInstanceOutcomeList(@RequestParam("programInfo") String programInfo,
      @RequestParam("courseId") String courseId) {
    BaseResponse response;
    try {
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      List<CourseInsOutcome> courseOutcomeList = courseInstanceOutcomeRepo
          .findParentByProgramInsIdAndCourseId(programIns.getId(), courseId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseOutcomeList);
      log.info("getCourseInstanceOutcomeList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseInstanceOutcomeList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "programs/{programId}/courses", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseList(@PathVariable("programId") String programId) {
    BaseResponse response;
    try {
      List<Course> courseList = courseRepo.findIdAndName(programId);
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseList);
      log.info("getCourseList SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseList ERROR with exception: ", ex);
      response = new PagingResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "programs/{programId}/courses/{courseId}/outcome-hierarchy", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseOutcomeHierarchy(@PathVariable("programId") String programId,
      @PathVariable("courseId") String courseId) {
    BaseResponse response;
    try {
      List<CourseOutcome> courseOutcomeList = courseOutcomeRepo.findByProgramIdAndCourseId(programId, courseId, 100, 0);
      List<CourseOutcomeExtend> courseOutcomeExtendList = Utils.convertToOutcomeHierarchy(courseOutcomeList);

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseOutcomeExtendList);
      log.info("getCourseOutcomeHierarchy SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseOutcomeHierarchy ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "program-instances/{programInfo}/course-instances/{courseId}/outcome-hierarchy", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getCourseInsOutcomeHierarchy(@PathVariable("programInfo") String programInfo,
      @PathVariable("courseId") String courseId) {
    BaseResponse response;
    try {
      ProgramIns programIns = Utils.getProgramInstanceId(programInsRepo, programInfo);
      List<CourseInsOutcome> courseInsOutcomeList = courseInsOutcomeRepo.findByProgramInsIdAndCourseId(programIns.getId(), courseId, 100, 0);
      List<CourseInsOutcomeExtend> courseInsOutcomeExtendList = Utils.convertToInsOutcomeHierarchy(courseInsOutcomeList);

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, courseInsOutcomeExtendList);
      log.info("getCourseOutcomeHierarchy SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getCourseOutcomeHierarchy ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @GetMapping(value = "survey/levels", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getSurveyLevel() {
    BaseResponse response;
    try {
      List<Level> levelList = levelRepo.find();

      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, levelList);
      log.info("getSurveyLevel SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getSurveyLevel ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
