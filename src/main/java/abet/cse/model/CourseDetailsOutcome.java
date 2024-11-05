package abet.cse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("course_ndct_course_outcome")
@NoArgsConstructor
public class CourseDetailsOutcome {
  @Id
  @Column("course_ndct_id")
  private Integer courseDetailsId;;
  @Column("course_outcome_id")
  private Integer outcomeId;

  public CourseDetailsOutcome(Integer courseDetailsId, Integer outcomeId) {
    this.courseDetailsId = courseDetailsId;
    this.outcomeId = outcomeId;
  }
}
