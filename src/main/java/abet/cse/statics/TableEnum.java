package abet.cse.statics;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TableEnum {
  COURSE("course"),
  PROGRAM("program"),
  ;

  private final String table;
}
