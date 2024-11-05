package abet.cse.repository;

import abet.cse.model.Program;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepo extends CrudRepository<Program, String> {

  @Query("SELECT count(*) FROM program where IFNULL(id_general_program, '') LIKE CONCAT('%',:idGeneralProgram,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(major, '') LIKE CONCAT('%',:major,'%')"
      + " AND IFNULL(id, '') LIKE CONCAT('%',:id,'%')"
      + " AND IFNULL(start, '') LIKE CONCAT('%',:start,'%')"
      + " AND IFNULL(end, '') LIKE CONCAT('%',:end,'%')"
      + " AND IFNULL(apply, '') LIKE CONCAT('%',:apply,'%')")
  Integer count(@Param("idGeneralProgram") String idGeneralProgram, @Param("description") String description,
      @Param("major") String major, @Param("id") String id, @Param("start") String start,
      @Param("end") String end, @Param("apply") String apply);

  @Query("SELECT id FROM program")
  List<String> findId();
}