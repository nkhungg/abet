package abet.cse.repository.assess;

import abet.cse.model.assess.ExitAssess;
import abet.cse.model.assess.ExitAssessExt;
import abet.cse.model.assess.ExitAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExitAssessRepo extends CrudRepository<ExitAssess, String> {

  @Query("SELECT a.*, b.indicator_name FROM exit_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName AND a.student_id >= :minStudentId AND a.student_id <= :maxStudentId")
  List<ExitAssessExt> find(@Param("surveyName") String surveyName,
      @Param("minStudentId") String minStudentId, @Param("maxStudentId") String maxStudentId);

  @Query("SELECT DISTINCT student_id FROM exit_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY student_id ASC LIMIT :limit OFFSET :offset")
  List<String> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT student_id) FROM exit_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM exit_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<ExitAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(student_id) FROM exit_assess WHERE student_id = :studentId AND survey_indicator_id = :surveyIndicatorId")
  Long find(@Param("studentId") String studentId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Modifying
  @Query("UPDATE exit_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " SET level = :level WHERE mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE exit_assess SET level = :level, mark = :mark WHERE student_id = :studentId AND survey_indicator_id = :surveyIndicatorId")
  Integer update(@Param("studentId") String studentId, @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM exit_assess WHERE student_id IN"
      + " (SELECT student_id FROM exit_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE student_id = :studentId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("studentId") String studentId);
}