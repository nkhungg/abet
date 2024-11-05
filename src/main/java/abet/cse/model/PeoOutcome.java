package abet.cse.model;

import abet.cse.dto.matrix.PeoOutcomeCell;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("peo_outcome")
@NoArgsConstructor
public class PeoOutcome {
  @Id
  private String programId;
  private String peoName;
  private String outcomeName;

  public PeoOutcome(String programId, PeoOutcomeCell peoOutcomeCell) {
    this.programId = programId;
    this.peoName = peoOutcomeCell.getPeoName();
    this.outcomeName = peoOutcomeCell.getOutcomeName();
  }
}
