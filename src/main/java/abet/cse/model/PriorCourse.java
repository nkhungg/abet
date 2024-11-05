package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("mon_hoc_truoc")
public class PriorCourse {

  @Id
  @Column("Id_mon_truoc")
  private String parallelCourseId;
  @Column("Id_mon")
  private String courseId;
  private String programId;
}
