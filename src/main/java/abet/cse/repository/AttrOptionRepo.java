package abet.cse.repository;

import abet.cse.model.AttrOptionModel;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AttrOptionRepo extends CrudRepository<AttrOptionModel, Integer> {

  @Query("SELECT * FROM attr_option WHERE id = :id LIMIT 1")
  AttrOptionModel findById(@Param("id") int id);

  @Query("SELECT * FROM attr_option WHERE attr_id = :attrId")
  List<AttrOptionModel> findByAttrId(@Param("attrId") int attrId);
}