package abet.cse.dto;

import abet.cse.statics.AbetCseStatusEnum;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class BaseResponse {

  private int code;
  private String viMessage;
  private String enMessage;
  private Object data;

  public BaseResponse(AbetCseStatusEnum statusEnum) {
    this.code = statusEnum.getCode();
    this.viMessage = statusEnum.getViMessage();
    this.enMessage = statusEnum.getEnMessage();
  }

  public BaseResponse(AbetCseStatusEnum statusEnum, Object data) {
    this(statusEnum);
    this.data = data;
  }
}
