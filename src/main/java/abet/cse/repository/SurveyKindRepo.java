package abet.cse.repository;

import abet.cse.model.SurveyKind;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyKindRepo extends CrudRepository<SurveyKind, String> {

}