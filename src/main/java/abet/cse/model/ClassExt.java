package abet.cse.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class ClassExt extends Class {

  private String lecturerName;
  private int studentAmount;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      ClassExt classExt = new ClassExt();
      classExt.setId(rs.getString("id"));
      classExt.setName(rs.getString("name"));
      classExt.setCourseInstanceId(rs.getString("course_instance_id"));
      classExt.setProgramInstanceId(rs.getInt("program_id"));
      classExt.setLecturerId(rs.getString("lecturer_id"));
      classExt.setLecturerName(rs.getString("lecturer_name"));
      return classExt;
    };
  }
}
