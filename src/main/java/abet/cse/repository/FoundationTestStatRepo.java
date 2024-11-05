package abet.cse.repository;

import abet.cse.model.FoundationTestStatAnswer;
import abet.cse.model.FoundationTestStatByCorrectAnswer;
import abet.cse.model.FoundationTestStatByGrade;
import abet.cse.model.FoundationTestStatByIndicator;
import abet.cse.model.FoundationTestStatByOutcome;
import abet.cse.model.FoundationTestStatBySubject;
import abet.cse.model.FoundationTestStatByYear;
import abet.cse.model.FoundationTestSubject;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FoundationTestStatRepo extends CrudRepository<FoundationTestSubject, Integer> {

  @Query("SELECT A.name, COUNT(*) as total, SUM(A.pass) AS pass, COUNT(*)-SUM(A.pass) AS fail\n"
      + "FROM (\n"
      + "    SELECT grading_foundation_test.question_id,\n"
      + "    CASE WHEN (SUM(IF(grading_foundation_test.result=foundation_test_question.answer, 1, 0))*100/:amount\n"
      + "    ) >= foundation_test_question.percent THEN 1 ELSE 0 END AS  pass, subject.name\n"
      + "    FROM grading_foundation_test, foundation_test_question,foundation_test_subject, subject\n"
      + "    WHERE foundation_test_question.test_id=:foundationTestId\n"
      + "    AND foundation_test_question.id=grading_foundation_test.question_id\n"
      + "    AND foundation_test_question.subject_id=foundation_test_subject.id\n"
      + "    AND foundation_test_subject.subject_id=subject.id\n"
      + "    GROUP BY grading_foundation_test.question_id ORDER BY grading_foundation_test.question_id) AS A\n"
      + "GROUP BY A.name")
  List<FoundationTestStatBySubject> statSubject(@Param("foundationTestId") String foundationTestId, @Param("amount") long amount);

  @Query("select C.grade, count(*) as count from (\n"
      + "    select A.student_id, CAST(count(*)*10/:amount AS UNSIGNED) as grade\n"
      + "    from grading_foundation_test A join foundation_test_question B\n"
      + "    on A.question_id=B.id and A.result=B.answer\n"
      + "    where B.test_id=:foundationTestId group by A.student_id order by A.student_id) as C\n"
      + "group by C.grade order by C.grade")
  List<FoundationTestStatByGrade> statGrade(@Param("foundationTestId") String foundationTestId, @Param("amount") long amount);

  @Query("select C.grade, count(*) as count from (\n"
      + "    select A.student_id, CAST(count(*)*10/:amount AS UNSIGNED) as grade\n"
      + "    from grading_foundation_test A join foundation_test_question B\n"
      + "    on A.question_id=B.id and A.result=B.answer and SUBSTRING(A.student_id,1,3) LIKE CONCAT(:year,'%')\n"
      + "    where B.test_id=:foundationTestId group by A.student_id order by A.student_id) as C\n"
      + "group by C.grade order by C.grade")
  List<FoundationTestStatByGrade> statGradeByYear(@Param("foundationTestId") String foundationTestId,
      @Param("amount") long amount, @Param("year") String year);

  @Query("select distinct SUBSTRING(student_id,1,3) as year, CAST(count(*)/:amount AS UNSIGNED) as count\n"
      + "from grading_foundation_test where grading_foundation_test.class_id=:foundationTestId group by year")
  List<FoundationTestStatByYear> statYear(@Param("foundationTestId") String foundationTestId, @Param("amount") long amount);

  @Query("select distinct SUBSTRING(student_id,1,3) as year, count(*) as count from (\n"
      + "    select A.student_id, CAST(count(*)*10/:amount AS UNSIGNED) as grade\n"
      + "    from grading_foundation_test A join foundation_test_question B\n"
      + "    on A.question_id=B.id and A.result=B.answer\n"
      + "    where B.test_id=:foundationTestId group by A.student_id order by A.student_id) as C\n"
      + "where C.grade = :grade group by year")
  List<FoundationTestStatByYear> statYearByGrade(@Param("foundationTestId") String foundationTestId,
      @Param("amount") long amount, @Param("grade") int grade);

  @Query("select A.question_id, SUM(IF(A.result=B.answer, 1, 0)) as count, :amount as total\n"
      + "from grading_foundation_test A join foundation_test_question B on A.question_id=B.id\n"
      + "where B.test_id=:foundationTestId group by A.question_id order by A.question_id")
  List<FoundationTestStatByCorrectAnswer> statCorrectAnswer(@Param("foundationTestId") String foundationTestId, @Param("amount") long amount);

  @Query("select A.question_id, SUM(IF(A.result=B.answer, 1, 0)) as count, :amount as total\n"
      + "from grading_foundation_test A join foundation_test_question B on A.question_id=B.id\n"
      + "where B.test_id=:foundationTestId and B.subject_id = :subjectId group by A.question_id order by A.question_id")
  List<FoundationTestStatByCorrectAnswer> statCorrectAnswerBySubjectId(@Param("foundationTestId") String foundationTestId,
      @Param("amount") long amount, @Param("subjectId") int subjectId);

  @Query("select A.question_id, SUM(IF(A.result=B.answer, 1, 0)) as count, :amount as total\n"
      + "from grading_foundation_test A join foundation_test_question B on A.question_id=B.id\n"
      + "where B.test_id=:foundationTestId and B.outcome_name = :outcomeName group by A.question_id order by A.question_id")
  List<FoundationTestStatByCorrectAnswer> statCorrectAnswerByOutcomeName(@Param("foundationTestId") String foundationTestId,
      @Param("amount") long amount, @Param("outcomeName") String outcomeName);

  @Query("select A.question_id, SUM(IF(A.result=B.answer, 1, 0)) as count, :amount as total\n"
      + "from grading_foundation_test A join foundation_test_question B on A.question_id=B.id\n"
      + "where B.test_id=:foundationTestId and B.indicator_name = :indicatorName group by A.question_id order by A.question_id")
  List<FoundationTestStatByCorrectAnswer> statCorrectAnswerByIndicatorName(@Param("foundationTestId") String foundationTestId,
      @Param("amount") long amount, @Param("indicatorName") String indicatorName);

  @Query("select C.outcome_name, D.description, count(*) as total,\n"
      + "SUM(C.pass) as pass, count(*)-SUM(C.pass) as fail from (select A.question_id,\n"
      + "case when (SUM(IF(A.result=B.answer, 1, 0))*100/:amount) >= B.percent\n"
      + "then 1 else 0 end as  pass, B.outcome_name\n"
      + "from grading_foundation_test A join foundation_test_question B on A.question_id=B.id\n"
      + "where B.test_id=:foundationTestId group by A.question_id order by A.question_id) as C\n"
      + "left join program_outcome D on C.outcome_name=D.outcome_name\n"
      + "group by C.outcome_name")
  List<FoundationTestStatByOutcome> statOutcome(@Param("foundationTestId") String foundationTestId, @Param("amount") long amount);

  @Query("select C.indicator_name, D.description, C.outcome_name, count(*) as total,\n"
      + "SUM(C.pass) as pass, count(*)-SUM(C.pass) as fail from (select A.question_id,\n"
      + "case when (SUM(IF(A.result=B.answer, 1, 0))*100/:amount) >= B.percent\n"
      + "then 1 else 0 end as  pass, B.indicator_name, B.outcome_name\n"
      + "from grading_foundation_test A join foundation_test_question B on A.question_id=B.id\n"
      + "where B.test_id=:foundationTestId group by A.question_id order by A.question_id) as C\n"
      + "left join performance_indicator D on C.indicator_name=D.name\n"
      + "group by C.indicator_name")
  List<FoundationTestStatByIndicator> statIndicator(@Param("foundationTestId") String foundationTestId, @Param("amount") long amount);

  @Query("select result, count(*) as count from grading_foundation_test where question_id = :questionId group by result")
  List<FoundationTestStatAnswer> statAnswer(@Param("questionId") String questionId);
}