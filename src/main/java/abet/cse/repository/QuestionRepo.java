package abet.cse.repository;

import abet.cse.model.Question;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepo extends CrudRepository<Question, String> {

  @Query("SELECT count(id) FROM question WHERE test_id = :testId AND class_id IS NULL"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(content, '') LIKE CONCAT('%',:content,'%')"
      + " AND IFNULL(percent, '') LIKE CONCAT('%',:percent,'%')"
      + " AND IFNULL(attach_file, '') LIKE CONCAT('%',:attachFile,'%')"
      + " AND IFNULL(max_score, '') LIKE CONCAT('%',:maxScore,'%')")
  long count(@Param("testId") String testId, @Param("name") String name, @Param("content") String content,
      @Param("percent") String percent, @Param("attachFile") String attachFile, @Param("maxScore") String maxScore);

  @Query("SELECT count(id) FROM question WHERE test_id = :testId AND (class_id = :classId OR class_id IS NULL)"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(content, '') LIKE CONCAT('%',:content,'%')"
      + " AND IFNULL(percent, '') LIKE CONCAT('%',:percent,'%')"
      + " AND IFNULL(attach_file, '') LIKE CONCAT('%',:attachFile,'%')"
      + " AND IFNULL(max_score, '') LIKE CONCAT('%',:maxScore,'%')")
  long count(@Param("testId") String testId, @Param("classId") String classId, @Param("name") String name, @Param("content") String content,
      @Param("percent") String percent, @Param("attachFile") String attachFile, @Param("maxScore") String maxScore);
}