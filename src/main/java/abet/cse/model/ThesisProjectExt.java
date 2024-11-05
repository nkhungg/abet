package abet.cse.model;

import java.util.List;
import lombok.Data;
import org.springframework.data.annotation.Transient;
import org.springframework.jdbc.core.RowMapper;

@Data
public class ThesisProjectExt extends ThesisProject {

  private String reviewerName;
  @Transient
  private List<ThesisProjectLecturerExt> lecturerList;
  private boolean isMultiMajor;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      ThesisProjectExt thesisProjectExt = new ThesisProjectExt();
      thesisProjectExt.setProjectId(rs.getString("project_id"));
      thesisProjectExt.setProjectName(rs.getString("project_name"));
      thesisProjectExt.setReviewerId(rs.getString("reviewer_id"));
      thesisProjectExt.setCouncil(rs.getString("council"));
      thesisProjectExt.setYear(rs.getInt("year"));
      thesisProjectExt.setSemester(rs.getInt("semester"));
      thesisProjectExt.setProgramId(rs.getString("program_id"));
      thesisProjectExt.setReviewerName(rs.getString("reviewer_name"));
      return thesisProjectExt;
    };
  }
}
