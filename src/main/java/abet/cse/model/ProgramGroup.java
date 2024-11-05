package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("program_group")
public class ProgramGroup {
  @Id
  private int id;
  private String name;
  private String programId;
}
