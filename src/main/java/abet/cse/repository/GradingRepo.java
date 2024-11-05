package abet.cse.repository;

import abet.cse.model.Grading;
import abet.cse.model.GradingExt;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GradingRepo extends CrudRepository<Grading, String> {

  @Query("SELECT student_id, question_id, name AS question_name, score FROM grading AS a LEFT JOIN question_course_outcome AS b ON a.question_course_outcome_id = b.id"
      + " LEFT JOIN question AS c ON b.question_id = c.id"
      + " WHERE IFNULL(a.class_id, '') LIKE CONCAT('%',:classId,'%') AND b.course_outcome_id = :outcomeId AND c.test_id = :testId ORDER BY a.student_id ASC")
  List<GradingExt> find(@Param("classId") String classId, @Param("testId") String testId, @Param("outcomeId") Integer outcomeId);
}