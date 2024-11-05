package abet.cse.utils;

import abet.cse.dto.CourseInsOutcomeExtend;
import abet.cse.dto.CourseOutcomeExtend;
import abet.cse.model.CourseInsOutcome;
import abet.cse.model.CourseOutcome;
import abet.cse.model.ProgramIns;
import abet.cse.model.SurveyIndicatorLevel;
import abet.cse.repository.ProgramInsRepo;
import abet.cse.statics.Constant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

@Slf4j
public class Utils {

  public static int calculateLastPage(long total, int pageSize) {
    int lastPage = -1;
    if (pageSize > 0) {
      lastPage = (int)Math.ceil((float)total / pageSize);
    }
    return lastPage;
  }

  public static List<Map<String, Object>> toMapList(List<String> strList) {
    List<Map<String, Object>> mapList = new ArrayList<>(strList.size());
    for (String idName : strList) {
      HashMap<String, Object> map = new HashMap<>();
      String[] arr = idName.split(Constant.COMMA);

      map.put("id", arr[0]);
      map.put("name", arr[1]);
      mapList.add(map);
    }
    return mapList;
  }

  public static String toSqlValue(String key, Float value) {
    return toSqlValue(key, String.valueOf(value), true);
  }

  public static String toSqlValue(String key, Byte value) {
    if (value == null) return "";
    return key + " = " + value + ", ";
  }

  public static String toSqlValue(String key, Integer value) {
    if (value == null) return "";
    return key + " = " + value + ", ";
  }

  public static String toSqlValue(String key, String value) {
    return toSqlValue(key, value, true);
  }

  public static String toSqlValue(String key, String value, boolean isComma) {
    if (StringUtils.isBlank(value) || value.equals("null")) return "";
    return key + " = '" + value + "'" + (isComma ? ", " : "");
  }

  public static String toInsertSqlValue(String... values) {
    String sqlValue = "";
    if (values.length > 0) sqlValue += ("(\"" + values[0] + "\"");
    for (int i = 1; i < values.length; i++) {
      sqlValue += (", \"" + values[i] + "\"");
    }
    if (values.length > 0) sqlValue += ")";
    return sqlValue;
  }

  public static List<CourseOutcomeExtend> convertToOutcomeHierarchy(List<CourseOutcome> list) {
    Map<Integer, CourseOutcomeExtend> map = new HashMap<>();
    List<CourseOutcome> childrenList = new ArrayList<>();
    for (CourseOutcome courseOutcome : list) {
      if (courseOutcome.getParentId() == null) {
        map.put(courseOutcome.getId(), new CourseOutcomeExtend(courseOutcome));
      } else {
        childrenList.add(courseOutcome);
      }
    }
    for (CourseOutcome courseOutcome : childrenList) {
      try {
        Integer parentId = courseOutcome.getParentId();
        CourseOutcomeExtend courseOutcomeExtend = map.get(parentId);
        courseOutcomeExtend.addCourseOutcome(courseOutcome);
      } catch (Exception ex) {
        log.error("Null parent with [CourseOutcome] {}", ObjectUtils.toJsonString(courseOutcome), ex);
      }
    }
    return new ArrayList<>(map.values());
  }

  public static List<CourseInsOutcomeExtend> convertToInsOutcomeHierarchy(List<CourseInsOutcome> list) {
    Map<Integer, CourseInsOutcomeExtend> map = new HashMap<>();
    List<CourseInsOutcome> childrenList = new ArrayList<>();
    for (CourseInsOutcome courseInsOutcome : list) {
      if (courseInsOutcome.getParentId() == null) {
        map.put(courseInsOutcome.getId(), new CourseInsOutcomeExtend(courseInsOutcome));
      } else {
        childrenList.add(courseInsOutcome);
      }
    }
    for (CourseInsOutcome courseInsOutcome : childrenList) {
      try {
        Integer parentId = courseInsOutcome.getParentId();
        CourseInsOutcomeExtend courseInsOutcomeExtend = map.get(parentId);
        courseInsOutcomeExtend.addCourseInsOutcome(courseInsOutcome);
      } catch (Exception ex) {
        log.error("Null parent with [CourseOutcome] {}", ObjectUtils.toJsonString(courseInsOutcome), ex);
      }
    }
    return new ArrayList<>(map.values());
  }

  public static ProgramIns getProgramInstanceId(ProgramInsRepo programInsRepo, String programInfo) {
    String[] array = programInfo.split(Constant.HYPHEN);
    int year = Integer.parseInt(array[1]);
    int semester = Integer.parseInt(array[2]);
    return programInsRepo.findByProgramIdAndYearAndSemester(array[0], year, semester);
  }

  public static String getLimitGrade(SurveyIndicatorLevel surveyIndicatorLevel) {
    Byte minFlag = surveyIndicatorLevel.getMinGradeFlag();
    String prefix = minFlag != null ? surveyIndicatorLevel.getMinGrade() + Utils.convertToFlag(minFlag) : "";
    Byte maxFlag = surveyIndicatorLevel.getMaxGradeFlag();
    String postfix = maxFlag != null ? Utils.convertToFlag(maxFlag) + surveyIndicatorLevel.getMaxGrade() : "";
    String openingBracket = "", grade = "", closingBracket = "";
    if (minFlag != null || maxFlag != null) {
      openingBracket = " (";
      grade = "Điểm";
      closingBracket = ")";
    }
    return openingBracket + prefix + grade + postfix + closingBracket;
  }

  public static String convertToFlag(Byte flag) {
    return flag == 0 ? " = " : (flag == 1 ? " < " : " <= ");
  }

  public static String getOrderPagingSql(String sortBy, String orderBy) {
    return " ORDER BY " + camel2Snake(sortBy) + " "
        + (orderBy.equalsIgnoreCase("DESC") ? "DESC" : "ASC")
        + " LIMIT ? OFFSET ?";
  }

  public static String camel2Snake(String str) {
    return str.replaceAll(Constant.REGEX, Constant.REPLACEMENT).toLowerCase();
  }

  public static String toSchoolYear(Integer year) {
    String schoolYear = String.valueOf(year % 2000);
    return year < 2014 ? "5" + schoolYear : schoolYear;
  }
}
