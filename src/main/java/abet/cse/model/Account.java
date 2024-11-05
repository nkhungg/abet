package abet.cse.model;

import abet.cse.dto.auth.SignupRequest;
import com.google.common.hash.Hashing;
import java.nio.charset.StandardCharsets;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("tbl_taikhoan")
@NoArgsConstructor
public class Account {
  @Id
  private long id;
  private String displayName;
  private String username;
  private String password;
  @Column("MaNhomQuyen")
  private long role;

  public Account(SignupRequest request) {
    String hashPassword = Hashing.sha256().hashString(
        request.getPassword(), StandardCharsets.UTF_8).toString();
    this.displayName = request.getDisplayName();
    this.username = request.getUsername();
    this.password = hashPassword;
    this.role = request.getRole();
  }
}
