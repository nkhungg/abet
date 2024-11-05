package abet.cse.model.assess;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("ce_hd_assess")
@NoArgsConstructor
public class CeHdAssess {
  @Id
  private Integer id;
  private Integer surveyIndicatorId;
  @Column("mscb")
  private String lecturerId;
  @Column("mssv")
  private String studentId;
  private String studentName;
  private String lecturerName;
  private Integer level;
  private String mark;

  public CeHdAssess(String lecturerId, String studentId, Integer surveyIndicatorId, Integer level, String mark) {
    this.lecturerId = lecturerId;
    this.studentId = studentId;
    this.surveyIndicatorId = surveyIndicatorId;
    this.level = level;
    this.mark = mark;
  }
}
