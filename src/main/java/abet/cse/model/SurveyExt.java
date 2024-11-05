package abet.cse.model;

import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class SurveyExt extends Survey {
  private String surveyTypeName;
  private String programVersionInfo;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      SurveyExt surveyExt = new SurveyExt();
      surveyExt.setName(rs.getString("name"));
      surveyExt.setDescription(rs.getString("description"));
      surveyExt.setSurveyKindName(rs.getString("survey_kind_name"));
      surveyExt.setProgramInstanceId(rs.getInt("program_instance_id"));
      surveyExt.setType(rs.getInt("type"));
      surveyExt.setLock(rs.getBoolean("lock"));
      surveyExt.setSurveyTypeName(rs.getString("survey_type_name"));
      surveyExt.setProgramVersionInfo(rs.getString("program_version_info"));
      return surveyExt;
    };
  }
}
