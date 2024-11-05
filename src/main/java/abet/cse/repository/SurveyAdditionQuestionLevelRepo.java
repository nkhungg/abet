package abet.cse.repository;

import abet.cse.model.SurveyAdditionQuestionLevel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyAdditionQuestionLevelRepo extends CrudRepository<SurveyAdditionQuestionLevel, Integer> {
}