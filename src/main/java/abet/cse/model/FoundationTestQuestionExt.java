package abet.cse.model;

import abet.cse.statics.Constant;
import java.util.Set;
import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

@Data
public class FoundationTestQuestionExt extends FoundationTestQuestion {

  private String subjectName;
  private String lecturerName;
  private String programVersionInfo;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      FoundationTestQuestionExt foundationTestQuestionExt = new FoundationTestQuestionExt();
      foundationTestQuestionExt.setId(rs.getString("id"));
      foundationTestQuestionExt.setName(rs.getString("name"));
      foundationTestQuestionExt.setContent(rs.getString("content"));
      foundationTestQuestionExt.setAnswer(rs.getString("answer"));
      foundationTestQuestionExt.setTestId(rs.getString("test_id"));
      foundationTestQuestionExt.setPercent(rs.getInt("percent"));
      foundationTestQuestionExt.setOutcomeName(rs.getString("outcome_name"));
      foundationTestQuestionExt.setIndicatorName(rs.getString("indicator_name"));
      foundationTestQuestionExt.setLevel(rs.getString("level"));
      foundationTestQuestionExt.setImage(rs.getString("image"));
      foundationTestQuestionExt.setLecturerId(rs.getString("lecturer_id"));
      foundationTestQuestionExt.setSubjectId(rs.getInt("subject_id"));
      foundationTestQuestionExt.setTime(rs.getInt("time"));
      foundationTestQuestionExt.setLecturerName(rs.getString("lecturer_name"));
      foundationTestQuestionExt.setSubjectName(rs.getString("subject_name"));
      String answerListStr = rs.getString("answer_str");
      if (answerListStr != null) {
        String[] answerStr = answerListStr.split("\\|");
        Set<FoundationTestAnswer> answerList = foundationTestQuestionExt.getAnswerSet();
        for (int i = 0; i < answerStr.length; i++) {
          String[] answerArr = answerStr[i].split(Constant.DASH);
          int length = answerArr.length;
          FoundationTestAnswer foundationTestAnswer = new FoundationTestAnswer();
          foundationTestAnswer.setQuestionId(foundationTestQuestionExt.getId());
          foundationTestAnswer.setAnswerId(length > 0 ? answerArr[0] : null);
          foundationTestAnswer.setDescription(length > 1 ? answerArr[1] : null);
          foundationTestAnswer.setImage(length > 2 ? answerArr[2] : null);
          answerList.add(foundationTestAnswer);
        }
      }
      return foundationTestQuestionExt;
    };
  }
}
