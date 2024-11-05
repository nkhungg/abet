package abet.cse.repository;

import abet.cse.model.PrerequisiteCourse;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PrerequisiteCourseRepo extends CrudRepository<PrerequisiteCourse, String> {

  @Query("SELECT Id_mon_tien_quyet FROM mon_hoc_tien_quyet WHERE program_id = :programId AND Id_mon = :courseId")
  List<String> findByProgramIdAndCourseId(
      @Param("programId") String programId, @Param("courseId") String courseId);

  @Query("SELECT name FROM mon_hoc_tien_quyet AS a LEFT JOIN course AS b"
      + " ON a.Id_mon = b.id AND a.program_id = b.program_id"
      + " WHERE a.program_id = :programId AND a.Id_mon = :courseId")
  List<String> findNameByProgramIdAndCourseId(
      @Param("programId") String programId, @Param("courseId") String courseId);
}