package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("semester")
public class Semester {
  @Id
  private int id;
  private String name;
  private String programId;
}
