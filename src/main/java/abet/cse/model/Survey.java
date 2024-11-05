package abet.cse.model;

import abet.cse.statics.Constant;
import abet.cse.utils.Utils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("survey")
@Slf4j
public class Survey {
  @Id
  private String name;
  private String description;
  private String surveyKindName;
  private Integer programInstanceId;
  private Integer type;
  private Boolean lock;

  public void setField(String programInfo, Integer programInsId) {
    this.name = programInfo.replaceAll(Constant.HYPHEN, Constant.DASH) + Constant.DASH + this.name;
    this.programInstanceId = programInsId;
  }

  public String toSql() {
    String sql = Utils.toSqlValue("description", description)
        + Utils.toSqlValue("type", type);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
