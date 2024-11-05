package abet.cse.repository.assess;

import abet.cse.model.assess.CommitAssess;
import abet.cse.model.assess.CommitAssessExt;
import abet.cse.model.assess.CommitAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommitAssessRepo extends CrudRepository<CommitAssess, Integer> {

  @Query("SELECT a.*, b.indicator_name FROM committee_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.question_id = b.id"
      + " WHERE b.survey_name = :surveyName"
      + " AND CONCAT(lecturer_id, '_', student_id) >= :lowerLimit"
      + " AND CONCAT(lecturer_id, '_', student_id) <= :upperLimit")
  List<CommitAssessExt> find(@Param("surveyName") String surveyName,
      @Param("lowerLimit") String lowerLimit, @Param("upperLimit") String upperLimit);

  @Query("SELECT DISTINCT CONCAT(lecturer_id, '_', student_id) AS lecturer_student FROM committee_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.question_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY lecturer_student ASC LIMIT :limit OFFSET :offset")
  List<String> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT CONCAT(a.lecturer_id, '_', a.student_id)) FROM committee_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.question_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM committee_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.question_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<CommitAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(id) FROM committee_assess WHERE lecturer_id = :lecturerId"
      + " AND student_id = :studentId AND question_id = :surveyIndicatorId")
  Integer count(@Param("lecturerId") String lecturerId, @Param("studentId") String studentId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Modifying
  @Query("UPDATE committee_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.question_id = b.id"
      + " SET level = :level WHERE mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE committee_assess SET level = :level, mark = :mark WHERE lecturer_id = :lecturerId"
      + " AND student_id = :studentId AND question_id = :surveyIndicatorId")
  Integer update(@Param("lecturerId") String lecturerId, @Param("studentId") String studentId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM committee_assess WHERE id IN"
      + " (SELECT a.id FROM committee_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.question_id = b.id"
      + " WHERE a.lecturer_id = :lecturerId AND a.student_id = :studentId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("lecturerId") String lecturerId, @Param("studentId") String studentId);
}