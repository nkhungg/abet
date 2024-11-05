package abet.cse.model.assess;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("intern")
@NoArgsConstructor
public class Intern {

  @Id
  private Integer internId;
  private String studentId;
  private String company;

  public Intern(String studentId, String company) {
    this.studentId = studentId;
    this.company = company;
  }
}
