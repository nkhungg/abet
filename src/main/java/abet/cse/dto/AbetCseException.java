package abet.cse.dto;

import abet.cse.statics.AbetCseStatusEnum;
import lombok.Data;

@Data
public class AbetCseException extends Exception {

  private final AbetCseStatusEnum statusEnum;

  public AbetCseException(AbetCseStatusEnum statusEnum) {
    super(statusEnum.getEnMessage());
    this.statusEnum = statusEnum;
  }
}
