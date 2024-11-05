package abet.cse.model;

import abet.cse.statics.Constant;
import java.util.Set;
import lombok.Data;
import org.springframework.data.annotation.Transient;
import org.springframework.jdbc.core.RowMapper;

@Data
public class SurveyIndicatorExt extends SurveyIndicator {

  private String optionStr;
  @Transient
  private String[] optionSet;

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      SurveyIndicatorExt surveyIndicatorExt = new SurveyIndicatorExt();
      surveyIndicatorExt.setId(rs.getInt("id"));
      surveyIndicatorExt.setSurveyName(rs.getString("survey_name"));
      surveyIndicatorExt.setProgramId(rs.getString("program_id"));
      surveyIndicatorExt.setIndicatorName(rs.getString("indicator_name"));
      surveyIndicatorExt.setAdditionalQuestion(rs.getString("additional_question"));
      surveyIndicatorExt.setComment(rs.getInt("comment"));
      surveyIndicatorExt.setDescription(rs.getString("description"));
      surveyIndicatorExt.setPriority(rs.getInt("priority"));
      surveyIndicatorExt.setMaxGrade(rs.getByte("max_grade"));
      surveyIndicatorExt.setOutcome(rs.getString("outcome"));
      surveyIndicatorExt.setMode(rs.getInt("mode"));
      String answerStr = rs.getString("answer_str");
      if (answerStr != null) {
        String[] answerArr = answerStr.split("\\|");
        Set<SurveyIndicatorLevel> answerSet = surveyIndicatorExt.getAnswerSet();
        for (int i = 0; i < answerArr.length; i++) {
          String[] levelArr = answerArr[i].split(Constant.DASH);
          int length = levelArr.length;
          SurveyIndicatorLevel surveyIndicatorLevel = new SurveyIndicatorLevel();
          surveyIndicatorLevel.setLevelId(length > 0 ? levelArr[0] : null);
          surveyIndicatorLevel.setSurveyIndicatorId(surveyIndicatorExt.getId());
          surveyIndicatorLevel.setDescription(length > 1 ? levelArr[1] : null);
          surveyIndicatorLevel.setMinGrade(length > 2 ? Byte.valueOf(levelArr[2]) : null);
          surveyIndicatorLevel.setMaxGrade(length > 3 ? Byte.valueOf(levelArr[3]) : null);
          surveyIndicatorLevel.setMinGradeFlag(length > 4 ? Byte.valueOf(levelArr[4]) : null);
          surveyIndicatorLevel.setMaxGradeFlag(length > 5 ? Byte.valueOf(levelArr[5]) : null);
          answerSet.add(surveyIndicatorLevel);
        }
      }
      String optionStr = rs.getString("option_str");
      if (optionStr != null) {
        surveyIndicatorExt.setOptionSet(optionStr.split("\\|"));
      }
      return surveyIndicatorExt;
    };
  }
}
