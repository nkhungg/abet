package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("mon_hoc_song_hanh")
public class ParallelCourse {

  @Id
  @Column("Id_mon_song_hanh")
  private String parallelCourseId;
  @Column("Id_mon")
  private String courseId;
  private String programId;
}
