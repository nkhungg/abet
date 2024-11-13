package abet.cse.statics;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AbetCseStatusEnum {
  REQUEST_OK(1, "Thành công","Success"),
  INVALID_PARAM_VALUES(-1, "Giá trị tham số không hợp lệ", "Invalid param values"),
  ACCOUNT_NOT_EXIST(-2, "Tài khoản không tồn tại", "Account not exist"),
  PASSWORD_INCORRECT(-3, "Sai mật khẩu", "Password incorrect"),
  SYSTEM_ERROR(-3, "Hệ thống đang có lỗi, vui lòng quay lại sau", "System error, please come back after a moment"),
  INVALID_PARAM_TYPES(-4, "Tham số không đúng định dạng", "Invalid param types"),
  SIGNUP_FAILURE(-5, "Đăng ký tài khoản thất bại", "Signup failure"),
  JWT_TOKEN_EXPIRED(-6, "Jwt token hết hạn", "Jwt token expired"),
  AUTHORIZATION_FAILURE(-7, "Xác thực người dùng thất bại", "Authorization failure"),
  INVALID_JWT_TOKEN(-8, "Jwt token không hợp lệ", "Invalid Jwt token"),
  DUPLICATED_ENTITY(-9, "Thực thể đã tồn tại", "Duplicated entity"),
  ENTITY_NOT_EXISTED(-10, "Thực thể không tồn tại", "Entity not existed"),
  INVALID_LIST(-11, "Danh sách không hợp lệ", "Invalid list"),
  TRANSLATE_TO_SQL_FAIL(-12, "Câu lệnh SQL không hợp lệ", "Translate to SQL fail"),
  QUESTION_COURSE_OUTCOME_EXISTED(-13, "Mục tiêu môn học đã tồn tại trong câu hỏi", "Question course outcome existed"),
  IMPORT_SURVEY_ASSESS_FAILED(-14, "Nhập liệu khảo sát đánh giá không hợp lệ", "Import survey assess invalidly"),
  BLANK_CLASS_ID(-15, "Định danh lớp không hợp lệ", "Blank class id"),
  IMPORT_FOUNDATION_TEST_GRADING_FAILED(-16, "Nhập liệu điểm kiểm tra cơ sở không hợp lệ", "Import foundation test grading invalidly"),
  ACCOUNT_ALREADY_EXISTS(-17, "Tài khoản đã tồn tại trong hệ thống", "Account already exists"),
  ;

  private final int code;
  private final String viMessage;
  private final String enMessage;
}
