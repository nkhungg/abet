package abet.cse.validator;

import abet.cse.dto.auth.LoginRequest;
import abet.cse.dto.auth.SignupRequest;
import abet.cse.model.OutcomeCourse;
import abet.cse.model.PeoOutcome;
import java.util.List;
import java.util.Objects;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class Validator {

  public boolean validateLogin(LoginRequest request) {
    return Objects.nonNull(request)
        && StringUtils.isNotBlank(request.getUsername())
        && StringUtils.isNotBlank(request.getPassword());
  }

  public boolean validateSignup(SignupRequest request) {
    return Objects.nonNull(request)
        && StringUtils.isNotBlank(request.getUsername())
        && StringUtils.isNotBlank(request.getPassword())
        && StringUtils.isNotBlank(request.getDisplayName())
        && request.getRole() > 0;
  }

  public static boolean validateAttr(int[] attrArray, String[] valueArray) {
    return attrArray.length == valueArray.length;
  }

  public static boolean validateAttr(String[] attrArray, String[] valueArray) {
    return attrArray.length == valueArray.length;
  }

  public static boolean checkPeoOutcomeMatrix(
      List<PeoOutcome> peoOutcomeList, String outcomeName, String peoName) {
    for (PeoOutcome peoOutcome : peoOutcomeList) {
      if (peoOutcome.getOutcomeName().equals(outcomeName) && peoOutcome.getPeoName().equals(peoName)) {
        return true;
      }
    }
    return false;
  }

  public static boolean checkOutcomeCourseMatrix(
      List<OutcomeCourse> outcomeCourseList, String outcomeName, String courseId) {
    for (OutcomeCourse outcomeCourse : outcomeCourseList) {
      if (outcomeCourse.getOutcomeName().equals(outcomeName) && outcomeCourse.getCourseId().equals(courseId)) {
        return true;
      }
    }
    return false;
  }
}
