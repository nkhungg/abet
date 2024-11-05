package abet.cse.model;

import abet.cse.statics.Constant;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.jdbc.core.RowMapper;

@Data
@Table("performance_indicator")
@NoArgsConstructor
public class Indicator {
  @Id
  private String name;
  private String description;
  private String outcomeName;
  private String programId;
  private int comment;
  private String additionalQuestion;
  private String descriptionVn;
  private String cdio;
  private String level;
  private String assessmentComment;

  public Indicator(String name, String description, String outcomeName, String programId,
      int comment, String additionalQuestion, String descriptionVn, String cdio, String level, String assessmentComment) {
    this.name = name;
    this.description = description;
    this.outcomeName = outcomeName;
    this.programId = programId;
    this.comment = comment;
    this.additionalQuestion = additionalQuestion;
    this.descriptionVn = descriptionVn;
    this.cdio = cdio;
    this.level = level;
    this.assessmentComment = assessmentComment;
  }

  public static RowMapper getRowMapper() {
    return (rs, rowNum) -> {
      Indicator indicator = new Indicator(rs.getString("name"), rs.getString("description"),
          rs.getString("outcome_name"), rs.getString("program_id"), rs.getInt("comment"),
          rs.getString("additional_question"), rs.getString("description_vn"), rs.getString("cdio"),
          rs.getString("level"), rs.getString("assessment_comment"));
      String levelListStr = rs.getString("level_str");
      if (levelListStr != null) {
        String[] levelStr = levelListStr.split("\\|");
        Set<IndicatorLevel> levelList = indicator.getIndicatorLevelSet();
        for (int i = 0; i < levelStr.length; i++) {
          String[] levelArr = levelStr[i].split(Constant.DASH);
          int length = levelArr.length;
          IndicatorLevel indicatorLevel = new IndicatorLevel();
          indicatorLevel.setLevelId(length > 0 ? levelArr[0] : null);
          indicatorLevel.setIndicatorName(indicator.getName());
          indicatorLevel.setProgramId(indicator.getProgramId());
          indicatorLevel.setDescription(length > 1 ? levelArr[1] : null);
          levelList.add(indicatorLevel);
        }
      }
      return indicator;
    };
  }

  @MappedCollection(idColumn = "indicator_name")
  private Set<IndicatorLevel> indicatorLevelSet = new TreeSet<>(
      Comparator.comparing(IndicatorLevel::getLevelId));

  public void addIndicatorLevel(String levelId, String description) {
    boolean found = false;
    for (IndicatorLevel indicatorLevel : indicatorLevelSet) {
      if (indicatorLevel.getLevelId() == levelId) {
        indicatorLevel.setDescription(description);
        found = true;
        break;
      }
    }
    if (!found) indicatorLevelSet.add(new IndicatorLevel(levelId, description, this));
  }
}
