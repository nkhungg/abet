package abet.cse.repository;

import abet.cse.model.Peo;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PeoRepo extends CrudRepository<Peo, String> {

  @Query("SELECT * FROM peo WHERE program_id = :programId LIMIT :limit OFFSET :offset")
  List<Peo> findByProgramId(
      @Param("programId") String programId,
      @Param("limit") int limit,
      @Param("offset") int offset);

  @Query("SELECT * FROM peo WHERE program_id = :programId AND name = :name")
  Peo findByProgramIdAndName(
      @Param("programId") String programId,
      @Param("name") String name);

  @Query("SELECT count(*) FROM peo where IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(priority, '') LIKE CONCAT('%',:priority,'%')")
  Integer count(@Param("name") String name, @Param("description") String description,
      @Param("programId") String programId, @Param("priority") String priority);
}