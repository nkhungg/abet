package abet.cse.dto.matrix;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OutcomeCourseCell {

  private String outcomeName;
  private String courseId;
  private boolean isCheck;
}
