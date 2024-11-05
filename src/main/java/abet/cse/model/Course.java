package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("course")
@NoArgsConstructor
@AllArgsConstructor
public class Course {
  @Id
  private String id;
  private String name;
  private String credit;
  private String programId;
  private Integer semesterId;
  private Integer groupId;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Course(rs.getString("id"), rs.getString("name"),
        rs.getString("credit"), rs.getString("program_id"),
        rs.getInt("semester_id"), rs.getInt("group_id"));
  }
}
