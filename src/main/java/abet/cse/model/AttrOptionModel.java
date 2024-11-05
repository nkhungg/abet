package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("attribute_option")
public class AttrOptionModel {
  @Id
  private int id;
  private int attrId;
  private String name;
}
