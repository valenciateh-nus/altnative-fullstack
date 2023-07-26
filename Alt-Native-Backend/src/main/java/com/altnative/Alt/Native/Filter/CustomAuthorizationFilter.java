package com.altnative.Alt.Native.Filter;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.UserNotVerifiedException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Service.AppUserService;
import com.altnative.Alt.Native.Utility.SecurityUtility;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {

    @Autowired
    private AppUserService appUserService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //log.info("Request path: " + request.getServletPath());
        if(request.getServletPath().equals("/login") || request.getServletPath().equals("/api/v1//user/token/refresh/**") || request.getServletPath().equals("/api/v1/register") || request.getServletPath().equals("/api/v1/business/register") || request.getServletPath().startsWith("/ws")) {
            //System.out.println("DOFILTERINTERNAL checking bearer");
            filterChain.doFilter(request,response);
            return;
        }

        String authHeader = request.getHeader(AUTHORIZATION);
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            log.info("Verifying auth header...");
            try {
                String token = authHeader.substring("Bearer ".length());
                DecodedJWT decodedJWT = SecurityUtility.decode_token(token);
                String username = decodedJWT.getSubject();
                AppUser user = appUserService.getUser(username);

//                if (user.getEnabled() == Boolean.FALSE) {
//                    throw new UserNotVerifiedException("User is not yet verified!");
//                }

                Collection<SimpleGrantedAuthority> auths = new HashSet<>();

                String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                for(Role role : user.getRoles()) {
                    auths.add(new SimpleGrantedAuthority(role.name()));
                }

                stream(roles).forEach(role -> {
                    auths.add(new SimpleGrantedAuthority(role));
                });

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, null, auths);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            } catch (Exception ex) {
                log.error("Error occurred while authorizing token/logging in: {}", ex.getMessage());
                response.setHeader("error", ex.getMessage());
                response.setStatus(HttpStatus.FORBIDDEN.value());
                Map<String, String> error = new HashMap<>();
                error.put("error", ex.getMessage());
                response.setContentType(APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), error);
                return;
            }

            filterChain.doFilter(request,response);

        } else {
            filterChain.doFilter(request,response);
        }

    }
}
