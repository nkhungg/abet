package abet.cse.repository;

import abet.cse.model.OutcomeCourse;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OutcomeCourseRepo extends CrudRepository<OutcomeCourse, String> {

  @Query("SELECT * FROM program_outcome_course WHERE program_id = :programId LIMIT :limit OFFSET :offset")
  List<OutcomeCourse> findByProgramId(
      @Param("programId") String programId,
      @Param("limit") int limit,
      @Param("offset") int offset);
}