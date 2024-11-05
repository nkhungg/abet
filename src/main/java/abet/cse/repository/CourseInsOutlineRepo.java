package abet.cse.repository;

import abet.cse.model.CourseInsOutline;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseInsOutlineRepo extends CrudRepository<CourseInsOutline, String> {

  @Query("SELECT * FROM course_instance WHERE program_id = :programInsId AND id = :id")
  CourseInsOutline findByProgramIdAndId(@Param("programInsId") Integer programInsId,
      @Param("id") String id);

}