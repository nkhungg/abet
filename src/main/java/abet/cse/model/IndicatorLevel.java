package abet.cse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("indicator_level")
@NoArgsConstructor
public class IndicatorLevel {
  @Id
  private String levelId;
  private String indicatorName;
  private String programId;
  private String description;

  public IndicatorLevel(String levelId, String description, Indicator indicator) {
    this.levelId = levelId;
    this.indicatorName = indicator.getName();
    this.programId = indicator.getProgramId();
    this.description = description;
  }
}
