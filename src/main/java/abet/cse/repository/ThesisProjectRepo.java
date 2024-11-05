package abet.cse.repository;

import abet.cse.model.ThesisProject;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThesisProjectRepo extends CrudRepository<ThesisProject, String> {

  @Query("SELECT count(a.project_id) FROM thesis_project AS a LEFT JOIN lecturer AS b ON a.reviewer_id = b.id"
      + " WHERE year = :year AND semester = :semester AND a.project_id LIKE 'PROJ_%'"
      + " AND IFNULL(a.project_name, '') LIKE CONCAT('%',:projectName,'%')"
      + " AND IFNULL(a.council, '') LIKE CONCAT('%',:council,'%')"
      + " AND IFNULL(b.name, '') LIKE CONCAT('%',:reviewerName,'%')")
  long count(@Param("year") Integer year, @Param("semester") Integer semester,
      @Param("projectName") String projectName, @Param("council") String council, @Param("reviewerName") String reviewerName);

  @Query("SELECT project_id FROM thesis_project where project_id LIKE CONCAT(:prefix,'%')")
  List<String> find(@Param("prefix") String prefix);

  @Query("SELECT project_id FROM thesis_project where project_name = :projectName LIMIT 1")
  String findProjectId(@Param("projectName") String projectName);
}