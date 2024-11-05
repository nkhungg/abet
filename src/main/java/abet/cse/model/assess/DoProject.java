package abet.cse.model.assess;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("do_project")
@NoArgsConstructor
public class DoProject {

  @Id
  private Integer doProjectId;
  private String studentId;
  private String projectId;

  public DoProject(String studentId, String projectId) {
    this.studentId = studentId;
    this.projectId = projectId;
  }
}
