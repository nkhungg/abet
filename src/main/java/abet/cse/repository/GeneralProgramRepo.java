package abet.cse.repository;

import abet.cse.model.GeneralProgram;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneralProgramRepo extends CrudRepository<GeneralProgram, String> {

  @Query("SELECT count(id) FROM general_program where IFNULL(id, '') LIKE CONCAT('%',:id,'%')"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(major, '') LIKE CONCAT('%',:major,'%')")
  Integer count(@Param("id") String id, @Param("name") String name,
      @Param("description") String description, @Param("major") String major);
}