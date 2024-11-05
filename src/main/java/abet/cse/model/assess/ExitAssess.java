package abet.cse.model.assess;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("exit_assess")
@NoArgsConstructor
@AllArgsConstructor
public class ExitAssess {
  @Id
  private String studentId;
  private Integer surveyIndicatorId;
  private Integer level;
  private String mark;
}
