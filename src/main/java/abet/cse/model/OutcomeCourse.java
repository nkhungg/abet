package abet.cse.model;

import abet.cse.dto.matrix.OutcomeCourseCell;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("program_outcome_course")
@NoArgsConstructor
public class OutcomeCourse {
  @Id
  private String programId;
  private String outcomeName;
  private String courseId;

  public OutcomeCourse(String programId, OutcomeCourseCell outcomeCourseCell) {
    this.programId = programId;
    this.outcomeName = outcomeCourseCell.getOutcomeName();
    this.courseId = outcomeCourseCell.getCourseId();
  }
}
