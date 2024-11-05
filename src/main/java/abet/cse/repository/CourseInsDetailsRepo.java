package abet.cse.repository;

import abet.cse.model.CourseInsDetails;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseInsDetailsRepo extends CrudRepository<CourseInsDetails, Integer> {

  @Query("SELECT * FROM course_instance_ndct WHERE program_id = :programInsId AND course_id = :courseId AND type = :type ORDER BY id ASC")
  List<CourseInsDetails> findByProgramInsIdAndCourseIdAndType(@Param("programInsId") Integer programInsId,
      @Param("courseId") String courseId, @Param("type") int type);
}