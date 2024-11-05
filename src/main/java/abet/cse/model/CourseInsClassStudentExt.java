package abet.cse.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class CourseInsClassStudentExt extends CourseInsClassStudent {

  private String name;
  private String major;
  private Integer year;
  private String email;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      CourseInsClassStudentExt courseInsClassStudentExt = new CourseInsClassStudentExt();
      courseInsClassStudentExt.setCourseInstanceId(rs.getString("course_instance_id"));
      courseInsClassStudentExt.setStudentId(rs.getString("student_id"));
      courseInsClassStudentExt.setClassId(rs.getString("class_id"));
      courseInsClassStudentExt.setName(rs.getString("name"));
      courseInsClassStudentExt.setMajor(rs.getString("major"));
      courseInsClassStudentExt.setYear(rs.getInt("year"));
      courseInsClassStudentExt.setEmail(rs.getString("email"));
      return courseInsClassStudentExt;
    };
  }
}
