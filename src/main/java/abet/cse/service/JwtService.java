package abet.cse.service;

import abet.cse.config.JwtConfig;
import abet.cse.dto.BaseResponse;
import abet.cse.statics.AbetCseStatusEnum;
import abet.cse.utils.ObjectUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtService {

  private final JwtConfig jwtConfig;

  public String generateToken(long id) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtConfig.getExpirationInHour() * 60 * 60 * 1000);

    return Jwts.builder()
        .setSubject(String.valueOf(id))
        .setIssuedAt(new Date())
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS256, jwtConfig.getSecret())
        .compact();
  }

  public long getUserIdFromJWT(String bearerToken) {
    String authToken = bearerToken.substring(7);
    Claims claims = Jwts.parser()
        .setSigningKey(jwtConfig.getSecret())
        .parseClaimsJws(authToken)
        .getBody();
    return Long.parseLong(claims.getSubject());
  }

  public String validateToken(String bearerToken) {
    BaseResponse response = null;
    try {
      if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        String authToken = bearerToken.substring(7);
        Jwts.parser().setSigningKey(jwtConfig.getSecret()).parseClaimsJws(authToken);
      } else {
        response = new BaseResponse(AbetCseStatusEnum.INVALID_JWT_TOKEN);
        log.error("Invalid JWT token: {}", bearerToken);
      }
    } catch (ExpiredJwtException ex) {
      response = new BaseResponse(AbetCseStatusEnum.JWT_TOKEN_EXPIRED);
      log.error("Expired JWT token: {}", bearerToken, ex);
    } catch (Exception ex) {
      response = new BaseResponse(AbetCseStatusEnum.AUTHORIZATION_FAILURE);
      log.error("Authorization FAILURE with JWT token: {}", bearerToken, ex);
    }
    return Objects.isNull(response) ? null : ObjectUtils.toJsonString(response);
  }

}
