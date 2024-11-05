package abet.cse.repository;

import abet.cse.model.Outcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OutcomeRepo extends CrudRepository<Outcome, String> {

  @Query("SELECT * FROM program_outcome WHERE program_id LIKE :programId LIMIT :limit OFFSET :offset")
  List<Outcome> findByProgramId(
      @Param("programId") String programId,
      @Param("limit") int limit,
      @Param("offset") int offset);

  @Query("SELECT * FROM program_outcome WHERE program_id = :programId AND outcome_name = :name")
  Outcome findByProgramIdAndName(
      @Param("programId") String programId,
      @Param("name") String name);

  @Query("SELECT count(*) FROM program_outcome WHERE program_id LIKE :programId")
  long countByProgramId(@Param("programId") String programId);

  @Query("SELECT count(*) FROM program_outcome WHERE IFNULL(outcome_name, '') LIKE CONCAT('%',:outcomeName,'%')"
      + " AND IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(cdio, '') LIKE CONCAT('%',:cdio,'%')")
  Integer count(@Param("outcomeName") String outcomeName, @Param("programId") String programId,
      @Param("description") String description, @Param("cdio") String cdio);
}