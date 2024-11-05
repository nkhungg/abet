package abet.cse.dto.auth;

import lombok.Data;

@Data
public class SignupRequest {

  private String username;
  private String password;
  private String displayName;
  private long role;
}
