package abet.cse.model.assess;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("committee_assess")
@NoArgsConstructor
public class CommitAssess {
  @Id
  private Integer id;
  private String lecturerId;
  private String projectId;
  private String studentId;
  @Column("question_id")
  private Integer surveyIndicatorId;
  private Integer level;
  private String mark;

  public CommitAssess(String lecturerId, String studentId, String projectId, Integer surveyIndicatorId, Integer level, String mark) {
    this.lecturerId = lecturerId;
    this.studentId = studentId;
    this.projectId = projectId;
    this.surveyIndicatorId = surveyIndicatorId;
    this.level = level;
    this.mark = mark;
  }
}
