package abet.cse.repository;

import abet.cse.model.CourseOutcome;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseOutcomeRepo extends CrudRepository<CourseOutcome, Integer> {

  @Query("SELECT * FROM course_outcome WHERE program_id = :programId "
      + "AND course_id = :courseId ORDER BY id ASC LIMIT :limit OFFSET :offset")
  List<CourseOutcome> findByProgramIdAndCourseId(@Param("programId") String programId,
      @Param("courseId") String courseId,
      @Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT * FROM course_outcome WHERE program_id = :programId "
      + "AND course_id = :courseId ORDER BY id ASC")
  List<CourseOutcome> findByProgramIdAndCourseId(@Param("programId") String programId,
      @Param("courseId") String courseId);

  @Query("SELECT * FROM course_outcome WHERE program_id = :programId "
      + "AND course_id = :courseId AND name = :name")
  CourseOutcome findByProgramIdAndCourseIdAndName(@Param("programId") String programId,
      @Param("courseId") String courseId, @Param("name") String name);

  @Query("SELECT count(id) FROM course_outcome WHERE IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(description, '') LIKE CONCAT('%',:description,'%')"
      + " AND IFNULL(program_id, '') LIKE CONCAT('%',:programId,'%')"
      + " AND IFNULL(course_id, '') LIKE CONCAT('%',:courseId,'%')"
      + " AND IFNULL(cdio, '') LIKE CONCAT('%',:cdio,'%')"
      + " AND IFNULL(indicator_name, '') LIKE CONCAT('%',:indicatorName,'%')"
      + " AND IFNULL(percent_indicator, '') LIKE CONCAT('%',:percentIndicator,'%')"
      + " AND IFNULL(parent_id, '') LIKE CONCAT('%',:parentId,'%')")
  Integer count(@Param("name") String name, @Param("description") String description,
      @Param("programId") String programId, @Param("courseId") String courseId, @Param("cdio") String cdio,
      @Param("indicatorName") String indicatorName, @Param("percentIndicator") String percentIndicator,
      @Param("parentId") String parentId);

  @Query("SELECT id, name, description FROM course_outcome WHERE program_id = :programId AND course_id = :courseId AND parent_id IS NULL")
  List<CourseOutcome> findColumnByProgramIdAndCourseId(@Param("programId") String programId,
      @Param("courseId") String courseId);
}