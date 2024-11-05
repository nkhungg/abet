package abet.cse.model.assess;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("mem_assess")
@NoArgsConstructor
@AllArgsConstructor
public class MemAssess {
  @Id
  private Integer doProjectId;
  private Integer surveyIndicatorId;
  private Integer level;
  private String mark;
}
