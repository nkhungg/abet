package abet.cse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("survey_addition_question_level")
@NoArgsConstructor
public class SurveyAdditionQuestionLevel {
  @Id
  private Integer id;
  private Integer surveyIndicatorId;
  private String description;

  public SurveyAdditionQuestionLevel(Integer surveyIndicatorId, String description) {
    this.surveyIndicatorId = surveyIndicatorId;
    this.description = description;
  }
}
