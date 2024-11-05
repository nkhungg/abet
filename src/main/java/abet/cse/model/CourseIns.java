package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("course_instance")
@NoArgsConstructor
public class CourseIns {
  @Id
  @Column("id")
  protected String courseId;
  protected String name;
  protected String credit;
  @Column("program_id")
  protected Integer programInstanceId;
  @Transient
  protected String programId;

  public CourseIns(ExtCourseIns extCourseInstance, int programInstanceId) {
    this.courseId = extCourseInstance.getCourseId();
    this.programInstanceId = programInstanceId;
    this.name = extCourseInstance.getName();
    this.credit = extCourseInstance.getCredit();
  }

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      CourseIns courseIns = new CourseIns();
      courseIns.setCourseId(rs.getString("id"));
      courseIns.setName(rs.getString("name"));
      courseIns.setCredit(rs.getString("credit"));
      courseIns.setProgramInstanceId(rs.getInt("program_id"));
      return courseIns;
    };
  }

  public String toSql() {
    String sql = Utils.toSqlValue("name", name)
        + Utils.toSqlValue("credit", credit);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
