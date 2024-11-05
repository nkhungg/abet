package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("class_assess")
@NoArgsConstructor
@AllArgsConstructor
public class ClassAssessment {

  private String classId;
  private String name;
  private Integer courseOutcomeInstanceId;
  private Float classThreshold;
  private String description;
  private String cdio;
  private Float threshold;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new ClassAssessment(rs.getString("class_id"), rs.getString("name"),
        rs.getInt("course_outcome_instance_id"), rs.getFloat("class_threshold"),
        rs.getString("description"), rs.getString("cdio"), rs.getFloat("threshold"));
  }

  public String toSql() {
    return Utils.toSqlValue("threshold", String.valueOf(classThreshold), false);
  }
}
