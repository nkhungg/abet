package abet.cse.repository;

import abet.cse.model.Lecturer;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerRepo extends CrudRepository<Lecturer, String> {

  @Query("SELECT count(id) FROM lecturer where IFNULL(id, '') LIKE CONCAT('%',:id,'%')"
      + " AND IFNULL(name, '') LIKE CONCAT('%',:name,'%')"
      + " AND IFNULL(faculty, '') LIKE CONCAT('%',:faculty,'%')"
      + " AND IFNULL(email, '') LIKE CONCAT('%',:email,'%')"
      + " AND IFNULL(department, '') LIKE CONCAT('%',:department,'%')"
      + " AND IFNULL(phone_number, '') LIKE CONCAT('%',:phoneNumber,'%')"
      + " AND IFNULL(contact_level, '') LIKE CONCAT('%',:contactLevel,'%')")
  Integer count(@Param("id") String id, @Param("name") String name,
      @Param("faculty") String faculty, @Param("email") String email, @Param("department") String department,
      @Param("phoneNumber") String phoneNumber, @Param("contactLevel") String contactLevel);
}