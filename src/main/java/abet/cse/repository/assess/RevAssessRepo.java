package abet.cse.repository.assess;

import abet.cse.model.assess.RevAssess;
import abet.cse.model.assess.RevAssessExt;
import abet.cse.model.assess.RevAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RevAssessRepo extends CrudRepository<RevAssess, Integer> {

  @Query("SELECT a.*, b.student_id, c.indicator_name"
      + " FROM rev_assess AS a LEFT JOIN do_project AS b ON a.do_project_id = b.do_project_id"
      + " LEFT JOIN survey_indicator AS c ON a.survey_indicator_id = c.id"
      + " WHERE c.survey_name = :surveyName AND a.do_project_id >= :minDoProjectId AND a.do_project_id <= :maxDoProjectId")
  List<RevAssessExt> find(@Param("surveyName") String surveyName,
      @Param("minDoProjectId") Integer minDoProjectId, @Param("maxDoProjectId") Integer maxDoProjectId);

  @Query("SELECT DISTINCT do_project_id FROM rev_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY a.do_project_id ASC LIMIT :limit OFFSET :offset")
  List<Integer> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT do_project_id) FROM rev_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM rev_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<RevAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(do_project_id) FROM rev_assess WHERE do_project_id = :doProjectId AND survey_indicator_id = :surveyIndicatorId")
  Long find(@Param("doProjectId") Integer doProjectId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Modifying
  @Query("UPDATE rev_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " SET level = :level WHERE mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE rev_assess SET level = :level, mark = :mark WHERE do_project_id = :doProjectId AND survey_indicator_id = :surveyIndicatorId")
  Integer update(@Param("doProjectId") Integer doProjectId, @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM rev_assess WHERE do_project_id IN"
      + " (SELECT do_project_id FROM rev_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE do_project_id = :doProjectId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("doProjectId") Integer doProjectId);

  @Modifying
  @Query("INSERT INTO rev_assess VALUES :values")
  Integer insert(@Param("values") String values);
}