package abet.cse.repository;

import abet.cse.model.CourseInsClassStudent;
import java.util.List;
import java.util.Set;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseInsClassStudentRepo extends CrudRepository<CourseInsClassStudent, String> {

  @Query("SELECT * FROM course_instance_class_student WHERE course_instance_id = :courseInsId")
  List<CourseInsClassStudent> find(@Param("courseInsId") String courseInsId);

  @Query("SELECT DISTINCT student_id FROM course_instance_class_student WHERE class_id LIKE CONCAT(:classIdPrefix,'%')")
  Set<String> findStudentId(@Param("classIdPrefix") String classIdPrefix);

  @Query("SELECT count(student_id) FROM course_instance_class_student WHERE class_id= :classId")
  int countByClassId(@Param("classId") String classId);

  @Query("SELECT count(*) FROM course_instance_class_student AS a LEFT JOIN student AS b"
      + " ON a.student_id = b.id WHERE a.class_id= :classId"
      + " AND IFNULL(a.student_id, '') LIKE CONCAT('%',:studentId,'%')"
      + " AND IFNULL(b.name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(b.major, '') LIKE CONCAT('%',:major,'%')"
      + " AND IFNULL(b.year, '') LIKE CONCAT('%',:year,'%')"
      + " AND IFNULL(b.email, '') LIKE CONCAT('%',:email,'%')")
  int count(@Param("classId") String classId, @Param("studentId") String studentId,
      @Param("name") String name, @Param("major") String major,
      @Param("year") String year, @Param("email") String email);
}