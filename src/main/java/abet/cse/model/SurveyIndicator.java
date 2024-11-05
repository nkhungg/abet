package abet.cse.model;

import abet.cse.statics.Constant;
import abet.cse.utils.Utils;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("survey_indicator")
@Slf4j
@NoArgsConstructor
public class SurveyIndicator implements Cloneable {
  @Id
  private Integer id;
  private String surveyName;
  private String programId;
  private String indicatorName;
  private String additionalQuestion;
  private Integer comment;
  private String description;
  private Integer priority;
  private Byte maxGrade;
  private String outcome;
  private Integer mode;

  @MappedCollection(idColumn = "survey_indicator_id")
  private Set<SurveyIndicatorLevel> answerSet = new HashSet<>();

  public SurveyIndicator(SurveyIndicatorExt surveyIndicatorExt) {
    this.surveyName = surveyIndicatorExt.getSurveyName();
    this.programId = surveyIndicatorExt.getProgramId();
    this.indicatorName = surveyIndicatorExt.getIndicatorName();
    this.additionalQuestion = surveyIndicatorExt.getAdditionalQuestion();
    this.comment = surveyIndicatorExt.getComment();
    this.description = surveyIndicatorExt.getDescription();
    this.priority = surveyIndicatorExt.getPriority();
    this.maxGrade = surveyIndicatorExt.getMaxGrade();
    this.outcome = surveyIndicatorExt.getOutcome();
  }

  public void setField(String programInfo, String surveyName) {
    this.programId = programInfo.split(Constant.HYPHEN)[0];
    this.surveyName = surveyName;
  }

  public String toSql() {
    String sql = Utils.toSqlValue("indicator_name", indicatorName)
        + Utils.toSqlValue("additional_question", additionalQuestion)
        + Utils.toSqlValue("comment", comment)
        + Utils.toSqlValue("description", description)
        + Utils.toSqlValue("priority", priority)
        + Utils.toSqlValue("max_grade", maxGrade)
        + Utils.toSqlValue("outcome", outcome);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
