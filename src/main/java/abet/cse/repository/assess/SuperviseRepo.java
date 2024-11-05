package abet.cse.repository.assess;

import abet.cse.model.assess.Supervise;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SuperviseRepo extends CrudRepository<Supervise, Integer> {

  @Query("SELECT supervise_id FROM supervise WHERE do_project_id = :doProjectId AND emp_id = :empId")
  Integer find(@Param("doProjectId") Integer doProjectId, @Param("empId") String empId);
}