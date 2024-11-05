package abet.cse.model;

import lombok.Data;

@Data
public class GradingExt extends Grading {

  private String questionId;
  private String questionName;
}
