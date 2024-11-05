package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("attribute")
public class AttributeModel {
  @Id
  private int id;
  private String name;
  private String type;
  private String tableName;
}
