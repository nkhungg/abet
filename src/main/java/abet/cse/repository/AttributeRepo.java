package abet.cse.repository;

import abet.cse.model.AttributeModel;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AttributeRepo extends CrudRepository<AttributeModel, Integer> {

  @Query("SELECT * FROM attribute LIMIT :limit OFFSET :offset")
  List<AttributeModel> findAll(@Param("limit") int limit, @Param("offset") int offset);

  @Query("SELECT * FROM attribute WHERE table_name = :tableName ORDER BY id ASC LIMIT :limit OFFSET :offset")
  List<AttributeModel> findByTable(
      @Param("tableName") String tableName,
      @Param("limit") int limit,
      @Param("offset") int offset);

  @Query("SELECT count(id) FROM attribute WHERE table_name = :tableName")
  long countByTable(@Param("tableName") String tableName);

  @Query("SELECT * FROM attribute WHERE id = :id LIMIT 1")
  AttributeModel findById(@Param("id") int id);
}