package abet.cse.repository;

import abet.cse.model.CourseOutline;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseOutlineRepo extends CrudRepository<CourseOutline, String> {

  @Query("SELECT * FROM course WHERE program_id = :programId AND id = :id")
  CourseOutline findByProgramIdAndId(@Param("programId") String programId,
      @Param("id") String id);

}