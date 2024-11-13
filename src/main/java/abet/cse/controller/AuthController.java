package abet.cse.controller;

import abet.cse.dto.auth.LoginRequest;
import abet.cse.dto.auth.LoginResponse;
import abet.cse.dto.auth.SignupRequest;
import abet.cse.dto.auth.SignupResponse;
import abet.cse.service.AuthService;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import abet.cse.validator.Validator;
import com.google.gson.JsonSyntaxException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

  private final AuthService authService;
  private final Validator validator;

  @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity login(@RequestBody String rawRequest) {
    LoginResponse response;
    try {
      LoginRequest request = ObjectUtils.fromJsonString(rawRequest, LoginRequest.class);
      if (!validator.validateLogin(request)) {
        response = new LoginResponse(AbetCseStatusEnum.INVALID_PARAM_VALUES);
      } else {
        response = authService.handleLogin(request);
      }
      log.info("login with [LoginRequest]: {}, [LoginResponse]: {}",
          rawRequest.replaceAll("\\s+", ""), ObjectUtils.toJsonString(response));
    } catch (JsonSyntaxException ex) {
      log.error("login ERROR with [LoginRequest]: {}, exception: ",
          rawRequest.replaceAll("\\s+", ""), ex);
      response = new LoginResponse(AbetCseStatusEnum.INVALID_PARAM_TYPES);
    } catch (Exception ex) {
      log.error("login ERROR with [LoginRequest]: {}, exception: ",
          rawRequest.replaceAll("\\s+", ""), ex);
      response = new LoginResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }

  @PostMapping(value = "/signup", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity signup(@RequestBody String rawRequest) {
    SignupResponse response;
    try {
      SignupRequest request = ObjectUtils.fromJsonString(rawRequest, SignupRequest.class);
      if (!validator.validateSignup(request)) {
        response = new SignupResponse(AbetCseStatusEnum.INVALID_PARAM_VALUES);
      } else {
        response = authService.handleSignup(request);
      }
      log.info("signup with [SignupRequest]: {}, [SignupResponse]: {}",
          rawRequest.replaceAll("\\s+", ""), ObjectUtils.toJsonString(response));
    } catch (JsonSyntaxException ex) {
      log.error("signup ERROR with [SignupRequest]: {}, exception ",
          rawRequest.replaceAll("\\s+", ""), ex);
      response = new SignupResponse(AbetCseStatusEnum.INVALID_PARAM_TYPES);
    } catch (Exception ex) {
      log.error("signup ERROR with [SignupRequest]: {}, exception ",
          rawRequest.replaceAll("\\s+", ""), ex);
      response = new SignupResponse(AbetCseStatusEnum.SYSTEM_ERROR);
    }
    return ResponseEntity.ok(ObjectUtils.toJsonString(response));
  }
}



