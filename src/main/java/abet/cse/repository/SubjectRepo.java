package abet.cse.repository;

import abet.cse.model.Subject;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepo extends CrudRepository<Subject, Integer> {

  @Query("SELECT count(id) FROM subject where IFNULL(name, '') LIKE CONCAT('%',:name,'%')")
  Integer count(@Param("name") String name);
}