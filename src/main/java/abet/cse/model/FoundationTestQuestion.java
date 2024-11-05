package abet.cse.model;

import abet.cse.statics.Constant;
import abet.cse.utils.Utils;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("foundation_test_question")
public class FoundationTestQuestion {

  @Id
  private String id;
  private String name;
  private String content;
  private String answer;
  private String testId;
  private Integer percent;
  private String outcomeName;
  private String indicatorName;
  private String level;
  private String image;
  private String lecturerId;
  private Integer subjectId;
  private Integer time;

  @MappedCollection(idColumn = "question_id")
  private Set<FoundationTestAnswer> answerSet = new HashSet<>();

  public void setField(String foundationTestId) {
    while (this.name.length() < 4) {
      this.name = "0" + this.name;
    }
    this.testId = foundationTestId;
    this.id = this.testId + Constant.DASH + this.name;
  }

  public String toSql() {
    String sql = Utils.toSqlValue("content", content)
        + Utils.toSqlValue("answer", answer)
        + Utils.toSqlValue("percent", percent)
        + Utils.toSqlValue("outcome_name", outcomeName)
        + Utils.toSqlValue("indicator_name", indicatorName)
        + Utils.toSqlValue("level", level)
        + Utils.toSqlValue("image", image)
        + Utils.toSqlValue("lecturer_id", lecturerId)
        + Utils.toSqlValue("subject_id", subjectId)
        + Utils.toSqlValue("time", time);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
