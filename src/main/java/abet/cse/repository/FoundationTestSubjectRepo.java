package abet.cse.repository;

import abet.cse.model.FoundationTestSubject;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FoundationTestSubjectRepo extends CrudRepository<FoundationTestSubject, Integer> {

  @Query("SELECT count(*) FROM foundation_test_subject AS a LEFT JOIN subject AS b"
      + " ON a.subject_id = b.id WHERE IFNULL(foundation_test_id, '') LIKE CONCAT('%',:foundationTestId,'%')"
      + " AND IFNULL(b.name, '') LIKE CONCAT('%',:subjectName,'%')")
  Long count(@Param("foundationTestId") String foundationTestId, @Param("subjectName") String subjectName);
}