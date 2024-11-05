package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("program_instance")
@NoArgsConstructor
@AllArgsConstructor
public class ProgramIns {
  @Id
  private Integer id;
  private Integer year;
  private Integer semester;
  private String programId;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new ProgramIns(rs.getInt("id"), rs.getInt("year"),
        rs.getInt("semester"), rs.getString("program_id"));
  }
}
