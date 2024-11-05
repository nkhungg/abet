package abet.cse.model.assess;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("par_assess")
@NoArgsConstructor
public class ParAssess {
  @Id
  private Integer id;
  private String projectId;
  private String studentId;
  private Integer surveyIndicatorId;
  private Integer level;
  private String mark;

  public ParAssess(String projectId, String studentId, Integer surveyIndicatorId, Integer level, String mark) {
    this.projectId = projectId;
    this.studentId = studentId;
    this.surveyIndicatorId = surveyIndicatorId;
    this.level = level;
    this.mark = mark;
  }
}
