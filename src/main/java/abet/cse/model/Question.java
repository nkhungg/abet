package abet.cse.model;

import abet.cse.statics.Constant;
import abet.cse.utils.Utils;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("question")
public class Question {
  @Id
  private String id;
  private String name;
  private String content;
  private String testId;
  private Integer percent;
  private Float maxScore;
  private String attachFile;
  private String classId;

  public Question(String id, String name, String content, String testId, Integer percent,
      Float maxScore, String attachFile, String classId) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.testId = testId;
    this.percent = percent;
    this.maxScore = maxScore;
    this.attachFile = attachFile;
    this.classId = classId;
  }

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      Question question = new Question(rs.getString("id"), rs.getString("name"),
          rs.getString("content"), rs.getString("test_id"), rs.getInt("percent"),
          rs.getFloat("max_score"), rs.getString("attach_file"), rs.getString("class_id"));
      String outcomeListStr = rs.getString("outcome_str");
      if (outcomeListStr != null) {
        String[] outcomeStr = outcomeListStr.split("\\|");
        Set<QuestionCourseOutcome> outcomeList = question.getOutcomeList();
        for (int i = 0; i < outcomeStr.length; i++) {
          String[] outcomeArr = outcomeStr[i].split(Constant.DASH);
          int length = outcomeArr.length;
          QuestionCourseOutcome questionCourseOutcome = new QuestionCourseOutcome();
          questionCourseOutcome.setId(length > 0 ? Integer.parseInt(outcomeArr[0]) : null);
          questionCourseOutcome.setQuestionId(question.getId());
          questionCourseOutcome.setCourseOutcomeId(length > 1 ? Integer.parseInt(outcomeArr[1]) : null);
          questionCourseOutcome.setCourseOutcomeName(length > 2 ? outcomeArr[2] : null);
          questionCourseOutcome.setComment(length > 3 ? outcomeArr[3] : null);
          questionCourseOutcome.setPercent(length > 4 ? Float.parseFloat(outcomeArr[4]) : null);
          outcomeList.add(questionCourseOutcome);
        }
      }
      return question;
    };
  }

  @MappedCollection(idColumn = "question_id")
  private Set<QuestionCourseOutcome> outcomeList = new HashSet<>();

  public void setField(String testId) {
    this.testId = testId;
    this.id = testId + Constant.DASH + this.name;
  }

  public String toSql() {
    String sql = Utils.toSqlValue("name", name)
        + Utils.toSqlValue("content", content)
        + Utils.toSqlValue("percent", percent)
        + Utils.toSqlValue("max_score", maxScore);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
