package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("course_outcome")
@AllArgsConstructor
@NoArgsConstructor
public class CourseOutcome {
  protected String name;
  protected String description;
  protected String programId;
  protected String courseId;
  protected String cdio;
  @Id
  protected Integer id;
  protected String indicatorName;
  protected Integer percentIndicator;
  protected Integer parentId;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new CourseOutcome(rs.getString("name"), rs.getString("description"),
        rs.getString("program_id"), rs.getString("course_id"),
        rs.getString("cdio"), rs.getInt("id"), rs.getString("indicator_name"),
        rs.getInt("percent_indicator"), rs.getInt("parent_id"));
  }

  public String toSql() {
    String sql = Utils.toSqlValue("description", description)
        + Utils.toSqlValue("cdio", cdio)
        + Utils.toSqlValue("indicator_name", indicatorName)
        + Utils.toSqlValue("percent_indicator", String.valueOf(percentIndicator))
        + Utils.toSqlValue("parent_id", String.valueOf(parentId));
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
