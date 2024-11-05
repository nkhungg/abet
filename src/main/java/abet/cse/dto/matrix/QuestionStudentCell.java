package abet.cse.dto.matrix;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuestionStudentCell {

  private String questionName;
  private String studentId;
  private String answer;
}
