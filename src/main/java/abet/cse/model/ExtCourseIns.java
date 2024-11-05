package abet.cse.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class ExtCourseIns extends CourseIns {

  private String programVersionInfo;
  private boolean outcomeChecked;
  private boolean outlineChecked;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      ExtCourseIns extCourseIns = new ExtCourseIns();
      extCourseIns.setCourseId(rs.getString("id"));
      extCourseIns.setName(rs.getString("name"));
      extCourseIns.setCredit(rs.getString("credit"));
      extCourseIns.setProgramInstanceId(rs.getInt("program_id"));
      extCourseIns.setProgramVersionInfo(rs.getString("program_version_info"));

      String[] programIdArr = extCourseIns.getProgramVersionInfo().split("-");
      extCourseIns.setProgramId(programIdArr[0]);
      return extCourseIns;
    };
  }
}
