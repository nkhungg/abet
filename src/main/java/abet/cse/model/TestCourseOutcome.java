package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("test_course_outcome")
public class TestCourseOutcome {
  @Id
  private Integer id;
  private String testId;
  private Integer courseOutcomeId;
  private Float percent;
  private String comment;

  public String toSql() {
    String sql = Utils.toSqlValue("course_outcome_id", courseOutcomeId)
        + Utils.toSqlValue("percent", percent)
        + Utils.toSqlValue("comment", comment);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
