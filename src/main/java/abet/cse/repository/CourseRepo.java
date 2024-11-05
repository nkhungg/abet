package abet.cse.repository;

import abet.cse.model.Course;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepo extends CrudRepository<Course, String> {

  @Query("SELECT * FROM course WHERE program_id = :programId AND id = :id")
  Course findByProgramIdAndId(@Param("programId") String programId,
      @Param("id") String id);

  @Query("SELECT * FROM course WHERE program_id = :programId LIMIT :limit OFFSET :offset")
  List<Course> findByProgramId(@Param("programId") String programId,
      @Param("limit") int limit,
      @Param("offset") int offset);

  @Query("SELECT count(*) FROM course WHERE IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(id, '') LIKE CONCAT('%',:id,'%')"
      + " AND IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(group_id, '') LIKE CONCAT('%',:groupId,'%')"
      + " AND IFNULL(semester_id, '') LIKE CONCAT('%',:semesterId,'%')")
  Integer count(@Param("name") String name, @Param("id") String id,
      @Param("programId") String programId, @Param("groupId") String groupId,
      @Param("semesterId") String semesterId);

  @Query("SELECT count(*) FROM course WHERE program_id = :programId")
  long countByProgramId(@Param("programId") String programId);

  @Query("SELECT id, name, credit FROM course where program_id = :programId")
  List<Course> findIdAndName(@Param("programId") String programId);
}