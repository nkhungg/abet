package abet.cse.repository;

import abet.cse.model.CourseDetailsOutcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseDetailsOutcomeRepo extends CrudRepository<CourseDetailsOutcome, Integer> {

  @Query("SELECT course_outcome_id FROM course_ndct_course_outcome WHERE course_ndct_id = :courseDetailsId")
  List<Integer> findOutcomeIdByCourseDetailsId(@Param("courseDetailsId") Integer courseDetailsId);
}