package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("class")
public class Class {
  @Id
  private String id;
  private String name;
  private String courseInstanceId;
  @Column("program_id")
  private Integer programInstanceId;
  private String lecturerId;

  public String toSql() {
    String sql = Utils.toSqlValue("name", name) + Utils.toSqlValue("lecturer_id", lecturerId);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
