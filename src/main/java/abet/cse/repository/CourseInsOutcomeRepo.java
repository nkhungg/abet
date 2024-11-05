package abet.cse.repository;

import abet.cse.model.CourseInsOutcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseInsOutcomeRepo extends CrudRepository<CourseInsOutcome, Integer> {

  @Query("SELECT * FROM course_outcome_instance WHERE program_id = :programInsId "
      + "AND course_id = :courseId LIMIT :limit OFFSET :offset")
  List<CourseInsOutcome> findByProgramInsIdAndCourseId(@Param("programInsId") Integer programInsId,
      @Param("courseId") String courseId,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT * FROM course_outcome_instance WHERE program_id = :programInsId "
      + "AND course_id = :courseId AND name = :name")
  CourseInsOutcome findByProgramInsIdAndCourseIdAndName(@Param("programInsId") Integer programInsId,
      @Param("courseId") String courseId, @Param("name") String name);

  @Query("SELECT id, name, indicator_name, percent_indicator FROM course_outcome_instance WHERE program_id = :programInsId AND course_id = :courseId")
  List<CourseInsOutcome> findColumnByProgramInsIdAndCourseId(@Param("programInsId") Integer programInsId,
      @Param("courseId") String courseId);

  @Query("SELECT id, name, indicator_name, percent_indicator FROM course_outcome_instance WHERE program_id = :programInsId AND course_id = :courseId AND parent_id IS NULL")
  List<CourseInsOutcome> findParentByProgramInsIdAndCourseId(@Param("programInsId") Integer programInsId,
      @Param("courseId") String courseId);

  @Query("SELECT count(id) FROM course_outcome_instance WHERE IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(course_id, '') LIKE CONCAT('%',:courseId,'%')"
      + " AND IFNULL(cdio, '') LIKE CONCAT('%',:cdio,'%')"
      + " AND IFNULL(indicator_name, '') LIKE CONCAT('%',:indicatorName,'%')"
      + " AND IFNULL(threshold, '') LIKE CONCAT('%',:threshold,'%')"
      + " AND IFNULL(percent_indicator, '') LIKE CONCAT('%',:percentIndicator,'%')"
      + " AND IFNULL(parent_id, '') LIKE CONCAT('%',:parentId,'%')")
  Integer count(@Param("name") String name, @Param("description") String description,
      @Param("programId") String programId, @Param("courseId") String courseId, @Param("cdio") String cdio,
      @Param("threshold") String threshold, @Param("indicatorName") String indicatorName,
      @Param("percentIndicator") String percentIndicator, @Param("parentId") String parentId);
}