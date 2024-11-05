package abet.cse.repository;

import abet.cse.model.QuestionCourseOutcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionCourseOutcomeRepo extends CrudRepository<QuestionCourseOutcome, Integer> {

  @Query("SELECT * FROM question_course_outcome WHERE question_id LIKE CONCAT(:testId, '%')")
  List<QuestionCourseOutcome> find(@Param("testId") String testId);
}