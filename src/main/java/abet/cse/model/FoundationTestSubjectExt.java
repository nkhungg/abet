package abet.cse.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class FoundationTestSubjectExt extends FoundationTestSubject {

  private String subjectName;
  private String programVersionInfo;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      FoundationTestSubjectExt foundationTestSubjectExt = new FoundationTestSubjectExt();
      foundationTestSubjectExt.setId(rs.getInt("id"));
      foundationTestSubjectExt.setFoundationTestId(rs.getString("foundation_test_id"));
      foundationTestSubjectExt.setSubjectId(rs.getInt("subject_id"));
      foundationTestSubjectExt.setSubjectName(rs.getString("subject_name"));
      return foundationTestSubjectExt;
    };
  }
}
