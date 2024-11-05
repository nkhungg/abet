package abet.cse.model.assess;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("supervise")
@NoArgsConstructor
public class Supervise {

  @Id
  private Integer superviseId;
  private Integer doProjectId;
  private String empId;

  public Supervise(Integer doProjectId, String empId) {
    this.doProjectId = doProjectId;
    this.empId = empId;
  }
}
