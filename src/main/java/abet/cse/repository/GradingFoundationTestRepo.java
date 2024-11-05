package abet.cse.repository;

import abet.cse.model.GradingFoundationTest;
import abet.cse.model.GradingFoundationTestExt;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GradingFoundationTestRepo extends CrudRepository<GradingFoundationTest, String> {

  @Query("SELECT DISTINCT student_id FROM grading_foundation_test WHERE class_id = :testId ORDER BY student_id ASC LIMIT :limit OFFSET :offset")
  List<String> find(@Param("testId") String testId, @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT student_id) FROM grading_foundation_test WHERE class_id = :testId")
  Long count(@Param("testId") String testId);

  @Query("SELECT a.*, b.name AS question_name FROM grading_foundation_test AS a LEFT JOIN foundation_test_question AS b"
      + " ON a.question_id = b.id WHERE a.class_id = :testId AND a.student_id >= :minStudentId AND a.student_id <= :maxStudentId")
  List<GradingFoundationTestExt> find(@Param("testId") String testId, @Param("minStudentId") String minStudentId,
      @Param("maxStudentId") String maxStudentId);

  @Modifying
  @Query("DELETE FROM grading_foundation_test WHERE student_id = :studentId AND class_id = :classId")
  Integer delete(@Param("studentId") String studentId, @Param("classId") String classId);
}