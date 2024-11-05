package abet.cse.repository;

import abet.cse.model.ThesisProjectLecturer;
import abet.cse.model.ThesisProjectLecturerExt;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThesisProjectLecturerRepo extends CrudRepository<ThesisProjectLecturer, String> {

  @Query("SELECT a.*, b.name AS lecturer_name FROM thesis_project_lecturer AS a LEFT JOIN lecturer AS b ON a.lecturer_id = b.id WHERE project_id = :projectId")
  List<ThesisProjectLecturerExt> find(@Param("projectId") String projectId);

  @Query("SELECT count(id) FROM thesis_project_lecturer WHERE project_id = :projectId")
  long count(@Param("projectId") String projectId);

  @Modifying
  @Query("DELETE FROM thesis_project_lecturer WHERE project_id = :projectId")
  Integer delete(@Param("projectId") String projectId);
}