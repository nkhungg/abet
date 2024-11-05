package abet.cse.dto.auth;

import abet.cse.dto.BaseResponse;
import abet.cse.statics.AbetCseStatusEnum;
import lombok.Data;

@Data
public class SignupResponse extends BaseResponse {

  public SignupResponse(AbetCseStatusEnum statusEnum) {
    super(statusEnum);
  }

}
