package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("peo")
@NoArgsConstructor
@AllArgsConstructor
public class Peo {
  @Id
  private String name;
  private String description;
  private String programId;
  private int priority;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Peo(rs.getString("name"), rs.getString("description"),
        rs.getString("program_id"), rs.getInt("priority"));
  }
}
