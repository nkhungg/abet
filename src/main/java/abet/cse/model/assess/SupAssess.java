package abet.cse.model.assess;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("sup_assess")
@AllArgsConstructor
@NoArgsConstructor
public class SupAssess {
  @Id
  private Integer superviseId;
  private Integer surveyIndicatorId;
  private Integer level;
  private String mark;
}
