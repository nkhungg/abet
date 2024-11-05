package abet.cse.model;

import java.util.HashSet;
import java.util.Set;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.MappedCollection;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("survey_kind")
public class SurveyKind {
  @Id
  private String name;
  private String description;

  @MappedCollection(idColumn = "survey_kind")
  private Set<SurveyType> typeList = new HashSet<>();
}
