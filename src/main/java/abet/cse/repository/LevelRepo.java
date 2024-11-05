package abet.cse.repository;

import abet.cse.model.Level;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LevelRepo extends CrudRepository<Level, Integer> {

  @Query("SELECT * FROM level")
  List<Level> find();
}