package abet.cse.dto.matrix;

import lombok.Data;

@Data
public class MatrixRowExtSupervisor<T> extends MatrixRow<T> {

  private String supervisor;
}
