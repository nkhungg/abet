package abet.cse.repository.assess;

import abet.cse.model.assess.CeParticipantAssess;
import abet.cse.model.assess.CeParticipantAssessExt;
import abet.cse.model.assess.CeParticipantAssessStat;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CeParticipantAssessRepo extends CrudRepository<CeParticipantAssess, Integer> {

  @Query("SELECT a.*, b.indicator_name FROM ce_participant_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName"
      + " AND CONCAT(participant, '_', mssv) >= :lowerLimit"
      + " AND CONCAT(participant, '_', mssv) <= :upperLimit")
  List<CeParticipantAssessExt> find(@Param("surveyName") String surveyName,
      @Param("lowerLimit") String lowerLimit, @Param("upperLimit") String upperLimit);

  @Query("SELECT DISTINCT CONCAT(participant, '_', mssv) AS participant_student FROM ce_participant_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName ORDER BY participant_student ASC LIMIT :limit OFFSET :offset")
  List<String> find(@Param("surveyName") String surveyName,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT count(DISTINCT CONCAT(participant, '_', mssv)) FROM ce_participant_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName")
  Long count(@Param("surveyName") String surveyName);

  @Query("SELECT level, mark, count(level) AS quantity FROM ce_participant_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE b.survey_name = :surveyName GROUP BY mark")
  List<CeParticipantAssessStat> find(@Param("surveyName") String surveyName);

  @Query("SELECT count(id) FROM ce_participant_assess WHERE participant = :participant"
      + " AND mssv = :studentId AND survey_indicator_id = :surveyIndicatorId")
  Integer count(@Param("participant") String participant, @Param("studentId") String studentId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId);

  @Modifying
  @Query("UPDATE ce_participant_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " SET level = :level WHERE mark = :mark AND b.survey_name = :surveyName")
  Integer update(@Param("surveyName") String surveyName,
      @Param("mark") String mark, @Param("level") Integer level);

  @Modifying
  @Query("UPDATE ce_participant_assess SET level = :level, mark = :mark WHERE participant = :participant"
      + " AND mssv = :studentId AND survey_indicator_id = :surveyIndicatorId")
  Integer update(@Param("participant") String participant, @Param("studentId") String studentId,
      @Param("surveyIndicatorId") Integer surveyIndicatorId,
      @Param("level") Integer level,  @Param("mark") String mark);

  @Modifying
  @Query("DELETE FROM ce_participant_assess WHERE id IN"
      + " (SELECT a.id FROM ce_participant_assess AS a"
      + " LEFT JOIN survey_indicator AS b ON a.survey_indicator_id = b.id"
      + " WHERE a.participant = :participant AND a.mssv = :studentId AND b.survey_name = :surveyName)")
  Integer delete(@Param("surveyName") String surveyName,
      @Param("participant") String participant, @Param("studentId") String studentId);
}