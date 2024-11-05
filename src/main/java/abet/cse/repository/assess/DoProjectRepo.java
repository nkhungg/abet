package abet.cse.repository.assess;

import abet.cse.model.assess.DoProject;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DoProjectRepo extends CrudRepository<DoProject, Integer> {

  @Query("SELECT do_project_id FROM do_project WHERE student_id = :studentId AND project_id = :projectId")
  Integer find(@Param("studentId") String studentId, @Param("projectId") String projectId);

  @Query("SELECT do_project_id FROM do_project AS a LEFT JOIN thesis_project AS b ON a.project_id = b.project_id"
      + " WHERE student_id = :studentId AND project_name = :projectName LIMIT 1")
  Integer findId(@Param("studentId") String studentId, @Param("projectName") String projectName);
}