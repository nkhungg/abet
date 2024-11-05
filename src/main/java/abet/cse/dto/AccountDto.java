package abet.cse.dto;

import abet.cse.model.Account;
import lombok.Data;

@Data
public class AccountDto {

  private Long id;
  private String displayName;
  private String username;
  private String role;

  public AccountDto(Account account) {
    this.id = account.getId();
    this.displayName = account.getDisplayName();
    this.username = account.getUsername();
  }
}
