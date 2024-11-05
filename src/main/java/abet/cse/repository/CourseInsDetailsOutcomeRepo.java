package abet.cse.repository;

import abet.cse.model.CourseInsDetailsOutcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseInsDetailsOutcomeRepo extends CrudRepository<CourseInsDetailsOutcome, Integer> {

  @Query("SELECT course_instance_ndct_id FROM course_instance_ndct_course_outcome_instance WHERE course_instance_ndct_id = :courseDetailsId")
  List<Integer> findOutcomeIdByCourseDetailsId(@Param("courseDetailsId") Integer courseDetailsId);
}