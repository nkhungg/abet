package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("grading")
@AllArgsConstructor
@NoArgsConstructor
public class Grading {

  @Id
  private String studentId;
  private String classId;
  private Integer questionCourseOutcomeId;
  private Float score;
}
