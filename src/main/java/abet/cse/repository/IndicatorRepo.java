package abet.cse.repository;

import abet.cse.model.Indicator;
import abet.cse.model.Outcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IndicatorRepo extends CrudRepository<Indicator, String> {

  @Query("SELECT * FROM performance_indicator WHERE program_id = :programId"
      + " AND outcome_name = :outcomeName AND name = :name")
  Outcome findByProgramIdAndOutcomeNameAndName(
      @Param("programId") String programId,
      @Param("outcomeName") String outcomeName,
      @Param("name") String name);

  @Query("SELECT count(*) FROM performance_indicator WHERE IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(outcome_name, '') LIKE CONCAT('%',:outcomeName,'%')"
      + " AND IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(cdio, '') LIKE CONCAT('%',:cdio,'%')")
  Integer count(@Param("name") String name, @Param("description") String description,
      @Param("outcomeName") String outcomeName, @Param("programId") String programId,
      @Param("cdio") String cdio);

  @Query("SELECT name FROM performance_indicator WHERE program_id = :programId")
  List<String> findNameByProgramId(@Param("programId") String programId);
}