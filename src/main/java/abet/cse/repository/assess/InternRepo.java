package abet.cse.repository.assess;

import abet.cse.model.assess.Intern;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InternRepo extends CrudRepository<Intern, Integer> {

  @Query("SELECT intern_id FROM intern WHERE student_id = :studentId LIMIT 1")
  Integer find(@Param("studentId") String studentId);
}