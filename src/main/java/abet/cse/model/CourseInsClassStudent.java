package abet.cse.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("course_instance_class_student")
@NoArgsConstructor
public class CourseInsClassStudent {
  private String courseInstanceId;
  @Id
  private String studentId;
  private String classId;

  public CourseInsClassStudent(String courseInstanceId, String classId, String studentId) {
    this.courseInstanceId = courseInstanceId;
    this.classId = classId;
    this.studentId = studentId;
  }
}
