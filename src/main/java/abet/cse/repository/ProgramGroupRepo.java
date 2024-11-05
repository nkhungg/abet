package abet.cse.repository;

import abet.cse.model.ProgramGroup;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramGroupRepo extends CrudRepository<ProgramGroup, String> {

  @Query("SELECT * FROM program_group WHERE program_id = :programId LIMIT :limit OFFSET :offset")
  List<ProgramGroup> findByProgramId(@Param("programId") String programId,
      @Param("limit") int limit,
      @Param("offset") int offset);

  @Query("SELECT * FROM program_group WHERE program_id = :programId AND id = :id")
  ProgramGroup findByProgramIdAndId(@Param("programId") String programId,
      @Param("id") int id);

  @Query("SELECT count(id) FROM program_group WHERE program_id = :programId")
  long countByProgramId(@Param("programId") String programId);
}