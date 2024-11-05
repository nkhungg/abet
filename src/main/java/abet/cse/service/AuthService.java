package abet.cse.service;

import abet.cse.dto.auth.LoginRequest;
import abet.cse.dto.auth.LoginResponse;
import abet.cse.dto.auth.SignupRequest;
import abet.cse.dto.auth.SignupResponse;
import abet.cse.dto.AccountDto;
import abet.cse.model.Role;
import abet.cse.model.Account;
import abet.cse.repository.RoleRepo;
import abet.cse.repository.AccountRepo;
import abet.cse.statics.AbetCseStatusEnum;
import com.google.common.hash.Hashing;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthService {

  private final AccountRepo accountRepo;
  private final RoleRepo roleRepo;
  private final JwtService jwtService;

  public LoginResponse handleLogin(LoginRequest request) {
    Account account = accountRepo.findByUsername(request.getUsername());
    if (Objects.isNull(account)) {
      return new LoginResponse(AbetCseStatusEnum.ACCOUNT_NOT_EXIST);
    }
    String hashPassword = Hashing.sha256().hashString(
        request.getPassword(), StandardCharsets.UTF_8).toString();
    if (!account.getPassword().equals(hashPassword)) {
      return new LoginResponse(AbetCseStatusEnum.PASSWORD_INCORRECT);
    }
    AccountDto accountDto = new AccountDto(account);
    Role role = roleRepo.findById(account.getRole());
    accountDto.setRole(role.getName());
    String accessToken = jwtService.generateToken(account.getId());
    LoginResponse response = new LoginResponse(AbetCseStatusEnum.REQUEST_OK, accessToken,
        accountDto);
    return response;
  }

  public SignupResponse handleSignup(SignupRequest request) {
    SignupResponse response;
    try {
      Account account = new Account(request);
      accountRepo.save(account);
      response = new SignupResponse(AbetCseStatusEnum.REQUEST_OK);
    } catch (Exception ex) {
      log.error("signup ERROR with exception: ", ex);
      response = new SignupResponse(AbetCseStatusEnum.SIGNUP_FAILURE);
    }
    return response;
  }
}
