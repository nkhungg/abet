package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("grading_foundation_test")
@NoArgsConstructor
@AllArgsConstructor
public class GradingFoundationTest {

  private Double score;
  @Id
  private String studentId;
  private String classId;
  private String result;
  private String questionId;
}
