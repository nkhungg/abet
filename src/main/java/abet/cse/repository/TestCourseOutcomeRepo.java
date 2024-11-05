package abet.cse.repository;

import abet.cse.model.TestCourseOutcome;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TestCourseOutcomeRepo extends CrudRepository<TestCourseOutcome, Integer> {

  @Query("SELECT count(a.id) FROM test_course_outcome AS a LEFT JOIN"
      + " course_outcome_instance AS b ON a.course_outcome_id = b.id WHERE test_id = :testId "
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(percent, '') LIKE CONCAT('%',:percent,'%')"
      + " AND IFNULL(a.comment, '') LIKE CONCAT('%',:comment,'%')")
  long count(@Param("testId") String testId, @Param("name") String name,
      @Param("description") String description, @Param("percent") String percent, @Param("comment") String comment);
}