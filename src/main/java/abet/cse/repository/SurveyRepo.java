package abet.cse.repository;

import abet.cse.model.Survey;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepo extends CrudRepository<Survey, String> {

  @Query("SELECT count(a.name) FROM survey AS a LEFT JOIN survey_type AS b ON a.type = b.id"
      + " LEFT JOIN program_instance AS c ON a.program_instance_id = c.id WHERE a.program_instance_id = :programInsId"
      + " AND IFNULL(a.name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(a.description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(a.survey_kind_name, '') LIKE CONCAT('%',:surveyKindName,'%')"
      + " AND IFNULL(b.name, '') LIKE CONCAT('%',:surveyTypeName,'%')")
  long count(@Param("programInsId") Integer programInsId, @Param("name") String name,
      @Param("description") String description, @Param("surveyKindName") String surveyKindName,
      @Param("surveyTypeName") String surveyTypeName);

  @Query("SELECT count(a.name) FROM survey AS a LEFT JOIN survey_type AS b ON a.type = b.id"
      + " LEFT JOIN program_instance AS c ON a.program_instance_id = c.id"
      + " WHERE IFNULL(a.name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(a.description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(a.survey_kind_name, '') LIKE CONCAT('%',:surveyKindName,'%')"
      + " AND IFNULL(b.name, '') LIKE CONCAT('%',:surveyTypeName,'%')")
  long count(@Param("name") String name, @Param("description") String description,
      @Param("surveyKindName") String surveyKindName, @Param("surveyTypeName") String surveyTypeName);

  @Query("SELECT `lock` FROM survey WHERE name = :surveyName")
  Boolean isLock(@Param("surveyName") String surveyName);
}