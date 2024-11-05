package abet.cse.dto.matrix;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseInsOutcomeIndicatorCell {

  private String outcomeName;
  private String indicatorName;
  private Integer percentIndicator;
}
