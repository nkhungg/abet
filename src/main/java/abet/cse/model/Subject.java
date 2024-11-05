package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("subject")
@AllArgsConstructor
@NoArgsConstructor
public class Subject {
  @Id
  private int id;
  private String name;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Subject(rs.getInt("id"), rs.getString("name"));
  }
}
