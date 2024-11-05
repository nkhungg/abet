package abet.cse.repository;

import abet.cse.model.Test;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepo extends CrudRepository<Test, String> {

  @Query("SELECT count(id) FROM test WHERE program_instance_id = :programInsId AND course_instance_id = :courseInsId"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(percent, '') LIKE CONCAT('%',:percent,'%')")
  long count(@Param("programInsId") Integer programInsId, @Param("courseInsId") String courseInsId,
      @Param("name") String name, @Param("percent") String percent);
}