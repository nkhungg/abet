package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("level")
public class Level {
  @Id
  private Integer levelId;
  private String levelName;
  private String description;
}
