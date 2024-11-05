package abet.cse.model.assess;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("ce_participant_assess")
@NoArgsConstructor
public class CeParticipantAssess {
  @Id
  private Integer id;
  private String participant;
  @Column("mssv")
  private String studentId;
  private String studentName;
  private Integer surveyIndicatorId;
  private Integer level;
  private String mark;

  public CeParticipantAssess(String participant, String studentName, String studentId, Integer surveyIndicatorId, Integer level, String mark) {
    this.participant = participant;
    this.studentName = studentName;
    this.studentId = studentId;
    this.surveyIndicatorId = surveyIndicatorId;
    this.level = level;
    this.mark = mark;
  }
}
