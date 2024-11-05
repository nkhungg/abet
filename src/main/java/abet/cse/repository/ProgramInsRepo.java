package abet.cse.repository;

import abet.cse.model.ProgramIns;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramInsRepo extends CrudRepository<ProgramIns, Integer> {

  @Query("SELECT CONCAT(program_id, '-', year, '-', semester) AS program_info FROM program_instance")
  List<String> findProgramInfo();

  @Query("SELECT * FROM program_instance WHERE program_id = :programId AND year = :year AND semester = :semester LIMIT 1")
  ProgramIns findByProgramIdAndYearAndSemester(@Param("programId") String programId,
      @Param("year") int year, @Param("semester") int semester);

  @Query("SELECT count(id) FROM program_instance where IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(year, '') LIKE CONCAT('%',:year,'%')"
      + " AND IFNULL(semester, '') LIKE CONCAT('%',:semester,'%')")
  Integer count(@Param("programId") String programId, @Param("year") String year,
      @Param("semester") String semester);
}