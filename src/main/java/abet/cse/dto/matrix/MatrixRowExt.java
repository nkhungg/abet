package abet.cse.dto.matrix;

import lombok.Data;

@Data
public class MatrixRowExt<T> extends MatrixRow<T> {

  private String subTitle;
  private String subSubTitle;
}
