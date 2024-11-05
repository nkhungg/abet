package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("program_outcome")
@NoArgsConstructor
@AllArgsConstructor
public class Outcome {
  @Id
  private String outcomeName;
  private String programId;
  private String description;
  private String cdio;
  private String descriptionVn;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Outcome(rs.getString("outcome_name"), rs.getString("program_id"),
        rs.getString("description"), rs.getString("cdio"), rs.getString("description_vn"));
  }
}
