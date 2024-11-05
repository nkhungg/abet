package abet.cse.repository;

import abet.cse.model.FoundationTestAnswer;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FoundationTestAnswerRepo extends CrudRepository<FoundationTestAnswer, String> {

  @Query("SELECT count(*) FROM foundation_test_answer WHERE question_id = :questionId AND answer_id = :answerId")
  Long find(@Param("questionId") String questionId, @Param("answerId") String answerId);

  @Query("SELECT * FROM foundation_test_answer WHERE question_id = :questionId")
  List<FoundationTestAnswer> find(@Param("questionId") String questionId);

  @Modifying
  @Query("DELETE FROM foundation_test_answer WHERE question_id = :questionId AND answer_id = :answerId")
  Long delete(@Param("questionId") String questionId, @Param("answerId") String answerId);

}