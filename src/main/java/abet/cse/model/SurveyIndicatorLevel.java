package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("survey_indicator_level")
@Slf4j
public class SurveyIndicatorLevel {
  @Id
  private String levelId;
  private Integer surveyIndicatorId;
  private String description;
  private Byte minGrade;
  private Byte maxGrade;
  private Byte minGradeFlag;
  private Byte maxGradeFlag;

  public String toSql() {
    String sql = Utils.toSqlValue("description", description)
        + Utils.toSqlValue("min_grade", minGrade)
        + Utils.toSqlValue("max_grade", maxGrade)
        + Utils.toSqlValue("min_grade_flag", minGradeFlag)
        + Utils.toSqlValue("max_grade_flag", maxGradeFlag);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
