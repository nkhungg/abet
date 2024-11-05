package abet.cse.repository.assess;

import abet.cse.model.assess.MemAssess;
import abet.cse.model.assess.MemAssessExt;
import abet.cse.model.assess.MemAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemAssessRepo extends CrudRepository<MemAssess, Integer> {

  @Query("SELECT a.*, b.student_id, c.indicator_name"
      + " FROM mem_assess AS a LEFT JOIN do_project AS b ON a.do_project_id = b.do_project_id"
      + " LEFT JOIN survey_indicator AS c ON a.survey_indicator_id = c.id"
      + " WHERE c.survey_name = :surveyName AND a.do_project_id >= :minDoProjectId AND a.do_project_id <= :maxDoProjectId")
  List<MemAssessExt> find(@Param("surveyName") String surveyName,
      @Param("minDoProjectId") Integer minDoProjectId, @Param("maxDoProjectId") Integer maxDoProjectId);

  @Query("SELECT DISTINCT do_project_id FROM mem_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY a.do_project_id ASC LIMIT :limit OFFSET :offset")
  List<Integer> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT do_project_id) FROM mem_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM mem_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<MemAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(do_project_id) FROM mem_assess WHERE do_project_id = :doProjectId AND survey_indicator_id = :surveyIndicatorId")
  Long find(@Param("doProjectId") Integer doProjectId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Modifying
  @Query("UPDATE mem_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " SET level = :level WHERE mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE mem_assess SET level = :level, mark = :mark WHERE do_project_id = :doProjectId AND survey_indicator_id = :surveyIndicatorId")
  Integer update(@Param("doProjectId") Integer doProjectId, @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM mem_assess WHERE do_project_id IN"
      + " (SELECT do_project_id FROM mem_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE do_project_id = :doProjectId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("doProjectId") Integer doProjectId);
}