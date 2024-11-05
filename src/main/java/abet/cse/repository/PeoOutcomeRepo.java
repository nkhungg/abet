package abet.cse.repository;

import abet.cse.model.PeoOutcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PeoOutcomeRepo extends CrudRepository<PeoOutcome, String> {

  @Query("SELECT * FROM peo_outcome WHERE program_id = :programId LIMIT :limit OFFSET :offset")
  List<PeoOutcome> findByProgramId(
      @Param("programId") String programId,
      @Param("limit") int limit,
      @Param("offset") int offset);
}