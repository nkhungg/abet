package abet.cse.statics;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AttrTypeEnum {
  SELECT("select"),
  TEXT("text"),
  IMAGE("image"),
  FILE("file"),
  ;

  private final String type;
}
