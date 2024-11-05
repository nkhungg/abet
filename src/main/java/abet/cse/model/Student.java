package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("student")
@NoArgsConstructor
@AllArgsConstructor
public class Student {
  @Id
  private String id;
  private String name;
  private String major;
  private int year;
  private String email;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Student(rs.getString("id"), rs.getString("name"),
        rs.getString("major"), rs.getInt("year"), rs.getString("email"));
  }
}
