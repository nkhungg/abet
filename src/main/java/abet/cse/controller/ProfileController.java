package abet.cse.controller;

import abet.cse.dto.AccountDto;
import abet.cse.dto.BaseResponse;
import abet.cse.model.Account;
import abet.cse.model.Role;
import abet.cse.repository.AccountRepo;
import abet.cse.repository.RoleRepo;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

  private final AccountRepo accountRepo;
  private final RoleRepo roleRepo;
  private final JwtService jwtService;

  @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity getUserProfile(@RequestHeader("Authorization") String bearerToken) {
    BaseResponse response;
    try {
      long userId = jwtService.getUserIdFromJWT(bearerToken);
      Account account = accountRepo.findById(userId).get();
      Role role = roleRepo.findById(account.getRole());
      AccountDto accountDto = new AccountDto(account);
      accountDto.setRole(role.getName());
      response = new BaseResponse(AbetCseStatusEnum.REQUEST_OK, accountDto);
      log.info("getUserProfile SUCCESS with [BaseResponse] {}", ObjectUtils.toJsonString(response));
    } catch (Exception ex) {
      log.error("getUserProfile ERROR with exception: ", ex);
      response = new BaseResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}
