package abet.cse.model;

import abet.cse.dto.AbetCseException;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.Utils;
import java.util.List;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("course_ndct")
public class CourseDetails {
  @Id
  private Integer id;
  private String courseId;
  private String programId;
  @Column("chuong")
  private String chapter;
  @Column("noi_dung")
  private String content;
  @Column("hoat_dong_danh_gia")
  private String reviewAction;
  @Column("chuan_dau_ra")
  private String outputStandard;
  private String type;
  @Transient
  private List<Integer> outcomeIdList;

  public String toSql() throws AbetCseException {
    String sql = Utils.toSqlValue("chuong", chapter)
        + Utils.toSqlValue("noi_dung", content)
        + Utils.toSqlValue("hoat_dong_danh_gia", reviewAction)
        + Utils.toSqlValue("chuan_dau_ra", outputStandard);
    if (StringUtils.isBlank(sql))
      throw new AbetCseException(AbetCseStatusEnum.TRANSLATE_TO_SQL_FAIL);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }
}
