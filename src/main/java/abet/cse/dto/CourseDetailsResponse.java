package abet.cse.dto;

import abet.cse.dto.attribute.AttrSelectedResponse;
import abet.cse.model.GeneralCourse;
import java.util.List;
import lombok.Data;

@Data
public class CourseDetailsResponse {

  private String id;
  private String name;
  private Integer groups;
  private String description;
  private List<AttrSelectedResponse> attrList;

  public CourseDetailsResponse(GeneralCourse generalCourse, List<AttrSelectedResponse> attrList) {
    this.id = generalCourse.getId();
    this.name = generalCourse.getName();
    this.groups = generalCourse.getGroups();
    this.description = generalCourse.getDescription();
    this.attrList = attrList;
  }
}
