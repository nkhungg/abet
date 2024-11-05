package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("lecturer")
@NoArgsConstructor
@AllArgsConstructor
public class Lecturer {
  @Id
  private String id;
  private String name;
  private String faculty;
  private String email;
  private String department;
  private String phoneNumber;
  private String contactLevel;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> new Lecturer(rs.getString("id"), rs.getString("name"),
        rs.getString("faculty"), rs.getString("email"), rs.getString("department"),
        rs.getString("phone_number"), rs.getString("contact_level"));
  }
}
