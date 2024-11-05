package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("course_outcome_instance")
@NoArgsConstructor
@AllArgsConstructor
public class CourseInsOutcome {
  protected String name;
  protected String description;
  @Column("program_id")
  protected Integer programInstanceId;
  protected String courseId;
  protected String cdio;
  @Id
  protected Integer id;
  protected Float threshold;
  protected String comment;
  protected String indicatorName;
  protected Integer percentIndicator;
  protected Integer parentId;
  protected Float classThreshold;

  public CourseInsOutcome(Integer programInstanceId, CourseOutcome courseOutcome) {
    this(programInstanceId, courseOutcome, courseOutcome.getParentId());
  }

  public CourseInsOutcome(Integer programInstanceId, CourseOutcome courseOutcome, Integer parentId) {
    name = courseOutcome.getName();
    description = courseOutcome.getDescription();
    this.programInstanceId = programInstanceId;
    courseId = courseOutcome.getCourseId();
    cdio = courseOutcome.getCdio();
    indicatorName = courseOutcome.getIndicatorName();
    percentIndicator = courseOutcome.getPercentIndicator();
    this.parentId = parentId;
  }

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new CourseInsOutcome(rs.getString("name"),
        rs.getString("description"), rs.getInt("program_id"),
        rs.getString("course_id"), rs.getString("cdio"), rs.getInt("id"),
        rs.getFloat("threshold"), rs.getString("comment"), rs.getString("indicator_name"),
        rs.getInt("percent_indicator"), rs.getInt("parent_id"), rs.getFloat("class_threshold"));
  }

  public String toSql() {
    String sql = Utils.toSqlValue("description", description)
        + Utils.toSqlValue("cdio", cdio)
        + Utils.toSqlValue("threshold", threshold)
        + Utils.toSqlValue("indicator_name", indicatorName)
        + Utils.toSqlValue("percent_indicator", percentIndicator)
        + Utils.toSqlValue("parent_id", parentId);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
