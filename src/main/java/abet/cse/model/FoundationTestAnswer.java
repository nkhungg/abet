package abet.cse.model;

import abet.cse.utils.Utils;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("foundation_test_answer")
public class FoundationTestAnswer {

  private String questionId;
  @Id
  private String answerId;
  private String description;
  private String image;

  public void setField(String questionId) {
    this.questionId = questionId;
  }

  public String toSql() {
    String sql = Utils.toSqlValue("description", description)
        + Utils.toSqlValue("image", image);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
