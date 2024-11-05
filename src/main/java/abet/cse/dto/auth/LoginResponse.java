package abet.cse.dto.auth;

import abet.cse.dto.BaseResponse;
import abet.cse.dto.AccountDto;
import abet.cse.statics.AbetCseStatusEnum;
import lombok.Data;

@Data
public class LoginResponse extends BaseResponse {

  private String accessToken;
  private AccountDto currentUser;

  public LoginResponse(AbetCseStatusEnum statusEnum) {
    super(statusEnum);
  }

  public LoginResponse(AbetCseStatusEnum statusEnum, String accessToken, AccountDto accountDto) {
    super(statusEnum);
    this.accessToken = accessToken;
    this.currentUser = accountDto;
  }
}
