package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("mon_hoc_truoc")
@Data
@AllArgsConstructor
public class PreviousSubject {
  @Column("id_mon_truoc")
  private String previous_course_id;
  @Column("id_mon")
  private String id;
  @Column("id_mon_truoc")
  private String programId;
}
