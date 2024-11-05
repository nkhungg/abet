package abet.cse.dto.matrix;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatrixRow<T> {
  
  private String title;
  private List<T> data;
}
