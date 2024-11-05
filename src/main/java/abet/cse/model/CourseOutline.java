package abet.cse.model;

import abet.cse.utils.Utils;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("course")
public class CourseOutline extends Course {
  private Integer stTong;
  private Integer stLt;
  private Integer stTh;
  private Integer stTn;
  private String stBtlTl;
  private String type;
  private Integer tlBt;
  private Integer tlTn;
  private Integer tlKt;
  private Integer tlBtlTl;
  private Integer tlThi;
  @Column("hinh_thuc_danh_gia")
  private String evaluationForm;
  private String ctdt;
  @Column("trinh_do_dao_tao")
  private String trainingDegree;
  private String groups;
  private String note;
  private String description;
  @Column("Tai_lieu")
  private String material;
  private String courseGoal;
  @Column("Huong_dan")
  private String guideline;
  @Column("can_bo_giang_day")
  private String teachingStaff;
  @Column("khoa_phu_trach")
  private String facultyInCharge;
  @Column("van_phong")
  private String office;
  @Column("dien_thoai")
  private String telephone;
  @Column("giang_vien_phu_trach")
  private String lecturerInCharge;
  private String email;
  private List<String> parallelCourseIdList = new ArrayList<>();
  private List<String> prerequisiteCourseIdList = new ArrayList<>();
  private List<String> priorCourseIdList = new ArrayList<>();

  public String toSql() {
    String sql = Utils.toSqlValue("credit", getCredit())
        + Utils.toSqlValue("st_tong", String.valueOf(stTong))
        + Utils.toSqlValue("st_lt", String.valueOf(stLt))
        + Utils.toSqlValue("st_th", String.valueOf(stTh))
        + Utils.toSqlValue("st_tn", String.valueOf(stTn))
        + Utils.toSqlValue("st_btl_tl", stBtlTl)
        + Utils.toSqlValue("type", type)
        + Utils.toSqlValue("tl_bt", String.valueOf(tlBt))
        + Utils.toSqlValue("tl_tn", String.valueOf(tlTn))
        + Utils.toSqlValue("tl_kt", String.valueOf(tlKt))
        + Utils.toSqlValue("tl_btl_tl", String.valueOf(tlBtlTl))
        + Utils.toSqlValue("tl_thi", String.valueOf(tlThi))
        + Utils.toSqlValue("hinh_thuc_danh_gia", evaluationForm)
        + Utils.toSqlValue("ctdt", ctdt)
        + Utils.toSqlValue("trinh_do_dao_tao", trainingDegree)
        + Utils.toSqlValue("groups", groups)
        + Utils.toSqlValue("note", note)
        + Utils.toSqlValue("description", description)
        + Utils.toSqlValue("Tai_lieu", material)
        + Utils.toSqlValue("course_goal", courseGoal)
        + Utils.toSqlValue("Huong_dan", guideline)
        + Utils.toSqlValue("can_bo_giang_day", teachingStaff)
        + Utils.toSqlValue("khoa_phu_trach", facultyInCharge)
        + Utils.toSqlValue("van_phong", office)
        + Utils.toSqlValue("dien_thoai", telephone)
        + Utils.toSqlValue("giang_vien_phu_trach", lecturerInCharge)
        + Utils.toSqlValue("email", email, false);
    if (sql.endsWith(", ")) return sql.substring(0, sql.length() - 2);
    return sql;
  }

  public void addCourseIdList(List<String> parallelCourseIdList,
      List<String> prerequisiteCourseIdList, List<String> priorCourseIdList) {
    this.parallelCourseIdList = parallelCourseIdList;
    this.prerequisiteCourseIdList = prerequisiteCourseIdList;
    this.priorCourseIdList = priorCourseIdList;
  }
}
