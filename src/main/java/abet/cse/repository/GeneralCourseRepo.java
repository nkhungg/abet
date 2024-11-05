package abet.cse.repository;

import abet.cse.model.GeneralCourse;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneralCourseRepo extends CrudRepository<GeneralCourse, String> {

  @Query("SELECT count(id) FROM general_course where IFNULL(id, '') LIKE CONCAT('%',:id,'%')"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(groups, '') LIKE CONCAT('%',:groups,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')")
  Integer count(@Param("id") String id, @Param("name") String name,
      @Param("groups") String groups, @Param("description") String description);

  @Query("SELECT CONCAT(id, ',', name) FROM general_course")
  List<String> findIdAndName();

  @Query("SELECT * FROM general_course WHERE id = :id LIMIT 1")
  Optional<GeneralCourse> findById(@Param("id") String id);
}