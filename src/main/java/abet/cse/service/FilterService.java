package abet.cse.service;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FilterService implements Filter {

  private final JwtService jwtService;

  @Override
  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
      FilterChain filterChain) throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest) servletRequest;
    String requestOrigin = request.getHeader("Origin");
    ((HttpServletResponse) servletResponse).addHeader("Access-Control-Allow-Origin", requestOrigin);
    ((HttpServletResponse) servletResponse).addHeader("Access-Control-Allow-Headers", "*");
    ((HttpServletResponse) servletResponse).addHeader("Access-Control-Allow-Methods",
        "GET, OPTIONS, HEAD, PUT, POST, DELETE");

//    String uri = request.getRequestURI();
//    boolean isPublic = !uri.startsWith("/api") || uri.startsWith("/api/login")
//        || uri.startsWith("/api/signup");
//    if (!isPublic) {
//      String bearToken = request.getHeader(Constant.AUTHORIZATION);
//      String rawResponse = jwtTokenProvider.validateToken(bearToken);
//      if (rawResponse != null) {
//        ((HttpServletResponse) servletResponse).setHeader("Content-Type", "application/json");
//        servletResponse.getOutputStream().write(rawResponse.getBytes());
//        return;
//      }
//    }

    filterChain.doFilter(servletRequest, servletResponse);
  }
}
