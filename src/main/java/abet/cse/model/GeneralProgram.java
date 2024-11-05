package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("general_program")
@NoArgsConstructor
@AllArgsConstructor
public class GeneralProgram {
  @Id
  private String id;
  private String name;
  private String description;
  private String major;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new GeneralProgram(rs.getString("id"), rs.getString("name"),
        rs.getString("description"), rs.getString("major"));
  }
}
