package abet.cse.dto.matrix;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PeoOutcomeCell {

  private String peoName;
  private String outcomeName;
  private boolean isCheck;
}
