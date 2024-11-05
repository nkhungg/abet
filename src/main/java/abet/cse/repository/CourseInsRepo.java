package abet.cse.repository;

import abet.cse.model.CourseIns;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseInsRepo extends CrudRepository<CourseIns, Integer> {

  @Query("SELECT count(*) FROM course_instance AS a LEFT JOIN program_instance AS b ON a.program_id = b.id"
      + " WHERE IFNULL(b.program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(a.id, '') LIKE CONCAT('%',:courseId,'%')"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')")
  Integer count(@Param("programId") String programId, @Param("courseId") String courseId,
      @Param("name") String name);

  @Query("SELECT count(*) FROM course_instance"
      + " WHERE IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(id, '') LIKE CONCAT('%',:courseId,'%')"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')")
  Integer countByProgramIns(@Param("programId") String programId, @Param("courseId") String courseId,
      @Param("name") String name);

  @Query("SELECT * FROM course_instance WHERE program_id = :programId AND id = :id LIMIT 1")
  CourseIns findByProgramIdAndId(@Param("programId") int programId, @Param("id") String id);
}