package abet.cse.model;

import abet.cse.statics.Constant;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("foundation_test_subject")
@NoArgsConstructor
public class FoundationTestSubject {

  @Id
  private Integer id;
  private Integer subjectId;
  private String foundationTestId;

  public FoundationTestSubject(Integer subjectId, String foundationTestId) {
    this.subjectId = subjectId;
    this.foundationTestId = foundationTestId.replaceAll(Constant.HYPHEN, Constant.DASH);
  }
}
