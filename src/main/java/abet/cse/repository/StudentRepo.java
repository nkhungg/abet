package abet.cse.repository;

import abet.cse.model.Student;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepo extends CrudRepository<Student, String> {

  @Query("SELECT count(id) FROM student where IFNULL(id, '') LIKE CONCAT('%',:id,'%')"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(major, '') LIKE CONCAT('%',:major,'%')"
      + " AND IFNULL(year, '') LIKE CONCAT('%',:year,'%')"
      + " AND IFNULL(email, '') LIKE CONCAT('%',:email,'%')")
  Integer count(@Param("id") String id, @Param("name") String name,
      @Param("major") String major, @Param("year") String year, @Param("email") String email);

  @Query("SELECT DISTINCT major from student")
  List<String> findMajor();

  @Query("SELECT DISTINCT year from student ORDER BY year DESC")
  List<Integer> findYear();
}