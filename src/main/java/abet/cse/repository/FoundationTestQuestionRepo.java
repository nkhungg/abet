package abet.cse.repository;

import abet.cse.model.FoundationTestQuestion;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FoundationTestQuestionRepo extends CrudRepository<FoundationTestQuestion, String> {

  @Query("SELECT count(a.id) FROM foundation_test_question AS a LEFT JOIN subject AS b ON a.subject_id = b.id"
      + " LEFT JOIN lecturer AS c ON a.lecturer_id = c.id  WHERE IFNULL(a.test_id, '') LIKE CONCAT('%',:testId,'%')"
      + " AND IFNULL(a.name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(a.content, '') LIKE CONCAT('%',:content,'%')"
      + " AND IFNULL(a.answer, '') LIKE CONCAT('%',:answer,'%')"
      + " AND IFNULL(a.percent, '') LIKE CONCAT('%',:percent,'%')"
      + " AND IFNULL(a.outcome_name, '') LIKE CONCAT('%',:outcomeName,'%')"
      + " AND IFNULL(a.level, '') LIKE CONCAT('%',:level,'%')"
      + " AND IFNULL(b.name, '') LIKE CONCAT('%',:subjectName,'%')"
      + " AND IFNULL(c.name, '') LIKE CONCAT('%',:lecturerName,'%')")
  Long count(@Param("testId") String testId, @Param("name") String name, @Param("content") String content,
      @Param("answer") String answer, @Param("percent") String percent, @Param("outcomeName") String outcomeName,
      @Param("level") String level, @Param("subjectName") String subjectName, @Param("lecturerName") String lecturerName);

  @Query("SELECT CONCAT(name, '-', IFNULL(answer, ' ')) FROM foundation_test_question WHERE test_id = :testId")
  List<String> find(@Param("testId") String testId);

  @Query("SELECT id FROM foundation_test_question WHERE test_id = :testId ORDER BY id ASC")
  List<String> findId(@Param("testId") String testId);

  @Query("SELECT count(id) FROM foundation_test_question WHERE test_id = :testId")
  Long countByTestId(@Param("testId") String testId);
}