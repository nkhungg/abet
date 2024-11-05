package abet.cse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.relational.core.mapping.Table;

@Table("general_course_attr_selected")
@Data
@AllArgsConstructor
public class GeneralCourseAttr {
  private int attrId;
  private String value;
}
