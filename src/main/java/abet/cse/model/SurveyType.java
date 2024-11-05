package abet.cse.model;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("survey_type")
@Slf4j
public class SurveyType {
  @Id
  private Integer id;
  private String name;
  private String surveyKind;
}
