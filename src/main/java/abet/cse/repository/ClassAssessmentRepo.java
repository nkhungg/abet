package abet.cse.repository;

import abet.cse.model.ClassAssessment;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassAssessmentRepo extends CrudRepository<ClassAssessment, String> {

  @Query("SELECT count(threshold) FROM class_assess WHERE class_id = :classId AND course_outcome_instance_id = :outcomeInsId")
  int countByClassIdAndOutcomeInsId(@Param("classId") String classId,
      @Param("outcomeInsId") Integer outcomeInsId);

  @Query("SELECT count(*) FROM class_assess AS a LEFT JOIN course_outcome_instance AS b"
      + " ON a.course_outcome_instance_id = b.id"
      + " WHERE a.class_id = :classId AND IFNULL(b.name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(b.description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(cdio, '') LIKE CONCAT('%',:cdio,'%')"
      + " AND IFNULL(b.threshold, '') LIKE CONCAT('%',:threshold,'%')"
      + " AND IFNULL(a.threshold, '') LIKE CONCAT('%',:classThreshold,'%')")
  long count(@Param("classId") String classId, @Param("name") String name,
      @Param("description") String description, @Param("cdio") String cdio,
      @Param("threshold") String threshold, @Param("classThreshold") String classThreshold);
}