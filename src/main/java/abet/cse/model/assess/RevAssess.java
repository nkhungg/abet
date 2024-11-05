package abet.cse.model.assess;

import abet.cse.statics.Constant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("rev_assess")
@NoArgsConstructor
@AllArgsConstructor
public class RevAssess {
  @Id
  private Integer doProjectId;
  private Integer surveyIndicatorId;
  private Integer level;
  private String mark;

  public String toSql() {
    return Constant.OPEN_PARENTHESIS + doProjectId
        + Constant.COMMA + surveyIndicatorId
        + Constant.COMMA + level
        + Constant.COMMA + mark + Constant.CLOSE_PARENTHESIS;
  }
}
