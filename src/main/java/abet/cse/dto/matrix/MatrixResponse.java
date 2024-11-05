package abet.cse.dto.matrix;

import java.util.List;
import lombok.Data;

@Data
public class MatrixResponse<T> {
  private List<String> columnList;
  private List<T> rowList;

  public MatrixResponse(List<String> peoNameList, List<T> rowList) {
    this.columnList = peoNameList;
    this.rowList = rowList;
  }
}
