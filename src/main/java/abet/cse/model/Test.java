package abet.cse.model;

import abet.cse.statics.Constant;
import abet.cse.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("test")
@NoArgsConstructor
@AllArgsConstructor
public class Test {
  @Id
  private String id;
  private Integer percent;
  private String name;
  private Integer programInstanceId;
  private String courseInstanceId;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Test(rs.getString("id"), rs.getInt("percent"),
        rs.getString("name"), rs.getInt("program_instance_id"), rs.getString("course_instance_id"));
  }

  public void setField(ProgramIns programIns, String programInfo, String courseId) {
    this.programInstanceId = programIns.getId();
    this.courseInstanceId = courseId;
    String id = programInfo.replaceAll(Constant.HYPHEN, Constant.DASH)
        + Constant.DASH + courseId + Constant.DASH + this.name;
    this.id = id.replaceAll(" ", "");
  }

  public String toSql() {
    String sql = Utils.toSqlValue("name", name)
        + Utils.toSqlValue("percent", percent);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
