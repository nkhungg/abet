package abet.cse.dto;

import abet.cse.model.CourseOutcome;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;

@Data
public class CourseOutcomeExtend extends CourseOutcome {

  private Set<CourseOutcome> secondary;

  public CourseOutcomeExtend(CourseOutcome courseOutcome) {
    this.name = courseOutcome.getName();
    this.description = courseOutcome.getDescription();
    this.programId = courseOutcome.getProgramId();
    this.courseId = courseOutcome.getCourseId();
    this.cdio = courseOutcome.getCdio();
    this.id = courseOutcome.getId();
    this.indicatorName = courseOutcome.getIndicatorName();
    this.percentIndicator = courseOutcome.getPercentIndicator();
    this.parentId = courseOutcome.getParentId();
    this.secondary = new HashSet<>();
  }

  public void addCourseOutcome(CourseOutcome courseOutcome) {
    this.secondary.add(courseOutcome);
  }
}
