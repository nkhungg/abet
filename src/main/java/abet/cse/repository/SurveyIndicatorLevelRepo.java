package abet.cse.repository;

import abet.cse.model.SurveyIndicatorLevel;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyIndicatorLevelRepo extends CrudRepository<SurveyIndicatorLevel, Integer> {

  @Query("SELECT 1 FROM survey_indicator_level WHERE survey_indicator_id = :surveyIndicatorId AND level_id = :levelId")
  Integer find(@Param("surveyIndicatorId") Integer surveyIndicatorId, @Param("levelId") String surveyName);

  @Query("SELECT * FROM survey_indicator_level WHERE survey_indicator_id = :surveyIndicatorId")
  List<SurveyIndicatorLevel> find(@Param("surveyIndicatorId") Integer surveyIndicatorId);
}