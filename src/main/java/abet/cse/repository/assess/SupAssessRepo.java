package abet.cse.repository.assess;

import abet.cse.model.assess.SupAssess;
import abet.cse.model.assess.SupAssessExt;
import abet.cse.model.assess.SupAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SupAssessRepo extends CrudRepository<SupAssess, Integer> {

  @Query("SELECT a.*, b.emp_id, c.student_id, d.indicator_name"
      + " FROM sup_assess AS a LEFT JOIN supervise AS b ON a.supervise_id = b.supervise_id"
      + " LEFT JOIN do_project AS c ON b.do_project_id = c.do_project_id"
      + " LEFT JOIN survey_indicator AS d ON a.survey_indicator_id = d.id"
      + " WHERE d.survey_name = :surveyName AND a.supervise_id >= :minSuperviseId AND a.supervise_id <= :maxSuperviseId")
  List<SupAssessExt> find(@Param("surveyName") String surveyName,
      @Param("minSuperviseId") Integer minSuperviseId, @Param("maxSuperviseId") Integer maxSuperviseId);

  @Query("SELECT DISTINCT supervise_id FROM sup_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY a.supervise_id ASC LIMIT :limit OFFSET :offset")
  List<Integer> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT supervise_id) FROM sup_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM sup_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<SupAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(supervise_id) FROM sup_assess WHERE supervise_id = :superviseId AND survey_indicator_id = :surveyIndicatorId")
  Long find(@Param("superviseId") Integer superviseId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Query("SELECT supervise_id FROM supervise AS a"
      + " LEFT JOIN do_project AS b ON a.do_project_id = b.do_project_id"
      + " WHERE a.emp_id = :empId AND b.student_id = :studentId LIMIT 1")
  Integer find(@Param("empId") String empId, @Param("studentId") String studentId);

  @Modifying
  @Query("UPDATE sup_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " SET level = :level WHERE a.mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE sup_assess SET level = :level, mark = :mark WHERE supervise_id = :superviseId AND survey_indicator_id = :surveyIndicatorId")
  Integer update(@Param("superviseId") Integer superviseId, @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM sup_assess WHERE supervise_id IN"
      + " (SELECT supervise_id FROM sup_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE supervise_id = :superviseId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("superviseId") Integer superviseId);
}