package abet.cse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("course_instance_ndct_course_outcome_instance")
@NoArgsConstructor
public class CourseInsDetailsOutcome {
  @Id
  @Column("course_instance_ndct_id")
  private Integer courseDetailsId;;
  @Column("course_outcome_instance_id")
  private Integer outcomeId;

  public CourseInsDetailsOutcome(Integer courseDetailsId, Integer outcomeId) {
    this.courseDetailsId = courseDetailsId;
    this.outcomeId = outcomeId;
  }
}
