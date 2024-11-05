package abet.cse.dto;

import abet.cse.model.CourseInsOutcome;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;

@Data
public class CourseInsOutcomeExtend extends CourseInsOutcome {

  private Set<CourseInsOutcome> secondary;

  public CourseInsOutcomeExtend(CourseInsOutcome courseInsOutcome) {
    this.name = courseInsOutcome.getName();
    this.description = courseInsOutcome.getDescription();
    this.programInstanceId = courseInsOutcome.getProgramInstanceId();
    this.courseId = courseInsOutcome.getCourseId();
    this.cdio = courseInsOutcome.getCdio();
    this.id = courseInsOutcome.getId();
    this.indicatorName = courseInsOutcome.getIndicatorName();
    this.percentIndicator = courseInsOutcome.getPercentIndicator();
    this.parentId = courseInsOutcome.getParentId();
    this.secondary = new HashSet<>();
  }

  public void addCourseInsOutcome(CourseInsOutcome courseInsOutcome) {
    this.secondary.add(courseInsOutcome);
  }
}
