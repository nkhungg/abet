package abet.cse.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class TestCourseOutcomeExt extends TestCourseOutcome {

  private String name;
  private String description;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      TestCourseOutcomeExt testCourseOutcomeExt = new TestCourseOutcomeExt();
      testCourseOutcomeExt.setId(rs.getInt("id"));
      testCourseOutcomeExt.setTestId(rs.getString("test_id"));
      testCourseOutcomeExt.setCourseOutcomeId(rs.getInt("course_outcome_id"));
      testCourseOutcomeExt.setPercent(rs.getFloat("percent"));
      testCourseOutcomeExt.setComment(rs.getString("comment"));
      testCourseOutcomeExt.setName(rs.getString("name"));
      testCourseOutcomeExt.setDescription(rs.getString("description"));
      return testCourseOutcomeExt;
    };
  }
}
