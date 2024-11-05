package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("question_course_outcome")
public class QuestionCourseOutcome {
  @Id
  private Integer id;
  private String questionId;
  private Integer courseOutcomeId;
  private String courseOutcomeName;
  private String comment;
  private Float percent;

  public String toSql() {
    String sql = Utils.toSqlValue("course_outcome_id", courseOutcomeId)
        + Utils.toSqlValue("course_outcome_name", courseOutcomeName)
        + Utils.toSqlValue("percent", percent)
        + Utils.toSqlValue("comment", comment);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
