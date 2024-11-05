package abet.cse.repository.assess;

import abet.cse.model.assess.IntAssess;
import abet.cse.model.assess.IntAssessExt;
import abet.cse.model.assess.IntAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IntAssessRepo extends CrudRepository<IntAssess, Integer> {

  @Query("SELECT a.*, b.student_id, c.indicator_name"
      + " FROM int_assess AS a LEFT JOIN intern AS b ON a.intern_id = b.intern_id"
      + " LEFT JOIN survey_indicator AS c ON a.survey_indicator_id = c.id"
      + " WHERE c.survey_name = :surveyName AND a.intern_id >= :minInternId AND a.intern_id <= :maxInternId")
  List<IntAssessExt> find(@Param("surveyName") String surveyName,
      @Param("minInternId") Integer minInternId, @Param("maxInternId") Integer maxInternId);

  @Query("SELECT DISTINCT intern_id FROM int_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY a.intern_id ASC LIMIT :limit OFFSET :offset")
  List<Integer> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT intern_id) FROM int_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM int_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<IntAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(intern_id) FROM int_assess WHERE intern_id = :internId AND survey_indicator_id = :surveyIndicatorId")
  Long find(@Param("internId") Integer internId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Modifying
  @Query("UPDATE int_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " SET level = :level WHERE mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE int_assess SET level = :level, mark = :mark WHERE intern_id = :internId AND survey_indicator_id = :surveyIndicatorId")
  Integer update(@Param("internId") Integer internId, @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM int_assess WHERE intern_id IN"
      + " (SELECT intern_id FROM int_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE intern_id = :internId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("internId") Integer internId);
}