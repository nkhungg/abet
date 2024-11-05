package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("program")
@NoArgsConstructor
@AllArgsConstructor
public class Program {
  private String idGeneralProgram;
  private String description;
  private String major;
  @Id
  private String id;
  private int start;
  private int end;
  private int apply;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Program(rs.getString("id_general_program"),
        rs.getString("description"), rs.getString("major"), rs.getString("id"),
        rs.getInt("start"), rs.getInt("end"), rs.getInt("apply"));
  }
}
