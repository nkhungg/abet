package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("mon_hoc_tien_quyet")
public class PrerequisiteCourse {

  @Id
  @Column("Id_mon_tien_quyet")
  private String parallelCourseId;
  @Column("Id_mon")
  private String courseId;
  private String programId;
}
