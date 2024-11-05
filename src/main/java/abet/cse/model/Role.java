package abet.cse.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("tbl_nhomquyen")
public class Role {
  @Id
  private long id;
  @Column("tenNhomQuyen")
  private String name;
}
