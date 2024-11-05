package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("thesis_project_lecturer")
@NoArgsConstructor
public class ThesisProjectLecturer {
  @Id
  private Integer id;
  private String projectId;
  private String lecturerId;
  private String role;

  public ThesisProjectLecturer(ThesisProject thesisProject) {
    this.projectId = thesisProject.getProjectId();
    this.lecturerId = thesisProject.getReviewerId();
    this.role = "primary supervisor";
  }

  public String toSql() {
    String sql = Utils.toSqlValue("role", role)
        + Utils.toSqlValue("lecturer_id", lecturerId);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
