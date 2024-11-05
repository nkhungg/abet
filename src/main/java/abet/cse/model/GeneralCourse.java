package abet.cse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("general_course")
@NoArgsConstructor
public class GeneralCourse {
  @Id
  private String id;
  private String name;
  private Integer groups;
  private String description;

  public GeneralCourse(String id, String name, Integer groups, String description) {
    this.id = id;
    this.name = name;
    this.groups = groups;
    this.description = description;
  }

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new GeneralCourse(rs.getString("id"), rs.getString("name"),
        rs.getInt("groups"), rs.getString("description"));
  }
}
