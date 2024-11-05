package abet.cse.repository;

import abet.cse.model.CourseDetails;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseDetailsRepo extends CrudRepository<CourseDetails, Integer> {

  @Query("SELECT * FROM course_ndct WHERE program_id = :programId AND course_id = :courseId AND type = :type ORDER BY id ASC")
  List<CourseDetails> findByProgramIdAndCourseIdAndType(@Param("programId") String programId,
      @Param("courseId") String courseId,
      @Param("type") int type);
}