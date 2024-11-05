package abet.cse.model;

import abet.cse.repository.ThesisProjectRepo;
import abet.cse.statics.Constant;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("thesis_project")
@Slf4j
@NoArgsConstructor
public class ThesisProject {
  @Id
  private String projectId;
  private String projectName;
  private String reviewerId;
  private String council;
  private Integer year;
  private Integer semester;
  private String programId;

  public ThesisProject(ThesisProjectExt thesisProjectExt) {
    this.projectId = thesisProjectExt.getProjectId();
    this.projectName = thesisProjectExt.getProjectName();
    this.reviewerId = thesisProjectExt.getReviewerId();
    this.council = thesisProjectExt.getCouncil();
    this.year = thesisProjectExt.getYear();
    this.semester = thesisProjectExt.getSemester();
    this.programId = thesisProjectExt.getProgramId();
  }

  public void setField(String programInfo, ThesisProjectRepo repo, boolean isMultiMajor) {
    String[] array = programInfo.split(Constant.HYPHEN);
    Integer year = Integer.parseInt(array[1]);
    Integer semester = Integer.parseInt(array[2]);

    if (!isMultiMajor) this.programId = array[0];
    this.year = year;
    this.semester = semester;

    String prefix = Constant.PROJ + Constant.DASH + this.year + Constant.DASH + this.semester + Constant.DASH;
    List<String> projectIdList = repo.find(prefix);
    int latestProjectNo = 0;
    for (String projectId : projectIdList) {
      try {
        Integer index = Integer.parseInt(projectId.split(Constant.DASH)[3]);
        if (latestProjectNo < index) latestProjectNo = index;
      } catch (Exception ex) {
        log.error("ThesisProject toSql ERROR with projectId: {}, exception: ", projectId, ex);
        continue;
      }
    }
    this.projectId = prefix + (latestProjectNo + 1);
  }

  public String toSql(String programInfo, boolean isMultiMajor) {
    String[] array = programInfo.split(Constant.HYPHEN);
    String sql = Utils.toSqlValue("project_name", projectName)
        + Utils.toSqlValue("reviewer_id", reviewerId)
        + Utils.toSqlValue("council", council)
        + (isMultiMajor ? "program_id = NULL" : "program_id = '" + array[0] + "'");
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
