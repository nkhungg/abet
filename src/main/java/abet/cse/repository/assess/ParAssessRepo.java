package abet.cse.repository.assess;

import abet.cse.model.assess.ParAssess;
import abet.cse.model.assess.ParAssessExt;
import abet.cse.model.assess.ParAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ParAssessRepo extends CrudRepository<ParAssess, Integer> {

  @Query("SELECT * FROM par_assess WHERE survey_indicator_id = :surveyIndicatorId ORDER BY id ASC")
  List<ParAssess> findBySurveyIndicatorId(@Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Query("SELECT a.*, b.indicator_name FROM par_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName"
      + " AND CONCAT(a.project_id, '_', LPAD(a.student_id, 4, 0)) >= :lowerLimit"
      + " AND CONCAT(project_id, '_', LPAD(student_id, 4, 0)) <= :upperLimit")
  List<ParAssessExt> find(@Param("surveyName") String surveyName,
      @Param("lowerLimit") String lowerLimit, @Param("upperLimit") String upperLimit);

  @Query("SELECT DISTINCT CONCAT(a.project_id, '_', LPAD(a.student_id, 4, 0)) AS project_student FROM par_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY project_student ASC LIMIT :limit OFFSET :offset")
  List<String> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT CONCAT(a.project_id, '_', a.student_id)) FROM par_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM par_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<ParAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(id) FROM par_assess WHERE project_id = :projectId"
      + " AND student_id = :studentId AND survey_indicator_id = :surveyIndicatorId")
  Integer count(@Param("projectId") String projectId, @Param("studentId") String studentId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Modifying
  @Query("UPDATE par_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " SET level = :level WHERE mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE par_assess SET level = :level, mark = :mark WHERE project_id = :projectId"
      + " AND student_id = :studentId AND survey_indicator_id = :surveyIndicatorId")
  Integer update(@Param("projectId") String projectId, @Param("studentId") String studentId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM par_assess WHERE id IN"
      + " (SELECT a.id FROM par_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE a.project_id = :projectId AND a.student_id = :studentId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("projectId") String projectId, @Param("studentId") String studentId);
}