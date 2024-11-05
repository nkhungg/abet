package abet.cse.repository;

import abet.cse.model.SurveyIndicator;
import abet.cse.model.SurveyIndicatorExt;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyIndicatorRepo extends CrudRepository<SurveyIndicator, Integer> {

  @Query("SELECT a.*, GROUP_CONCAT(b.description SEPARATOR '|') AS option_str FROM survey_indicator AS a LEFT JOIN survey_addition_question_level AS b"
      + " ON a.id = b.survey_indicator_id WHERE survey_name = :surveyName GROUP BY a.id LIMIT :limit OFFSET :offset")
  List<SurveyIndicatorExt> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT id FROM survey_indicator WHERE survey_name = :surveyName ORDER BY priority ASC")
  List<Integer> findIdList(@Param("surveyName") String surveyName);

  @Query("SELECT DISTINCT indicator_name FROM survey_indicator WHERE survey_name = :surveyName")
  List<String> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(id) FROM survey_indicator WHERE survey_name = :surveyName"
      + " AND IFNULL(indicator_name, '') LIKE CONCAT('%',:indicatorName,'%')"
      + " AND IFNULL(max_grade, '') LIKE CONCAT('%',:maxGrade,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(priority, '') LIKE CONCAT('%',:priority,'%')"
      + " AND IFNULL(outcome, '') LIKE CONCAT('%',:outcome,'%')"
      + " AND IFNULL(additional_question, '') LIKE CONCAT('%',:additionalQuestion,'%')")
  long count(@Param("surveyName") String surveyName, @Param("indicatorName") String indicatorName,
      @Param("maxGrade") String maxGrade, @Param("description") String description,
      @Param("priority") String priority, @Param("outcome") String outcome,
      @Param("additionalQuestion") String additionalQuestion);
}