package abet.cse.repository;

import abet.cse.model.Class;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepo extends CrudRepository<Class, String> {

  @Query("SELECT count(a.id) FROM class AS a LEFT JOIN lecturer AS b"
      + " ON a.lecturer_id = b.id WHERE a.program_id = :programInsId AND a.course_instance_id = :courseInsId"
      + " AND IFNULL(a.name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(a.lecturer_id, '') LIKE CONCAT('%',:lecturerId,'%')"
      + " AND IFNULL(b.name, '') LIKE CONCAT('%',:lecturerName,'%')")
  long count(@Param("programInsId") Integer programInsId, @Param("courseInsId") String courseInsId,
      @Param("name") String name, @Param("lecturerId") String lecturerId, @Param("lecturerName") String lecturerName);
}