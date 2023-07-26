package com.altnative.Alt.Native.Utility;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Model.AppUser;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class SecurityUtility {
    private static final String SECRET_KEY = "58VE!eeZ6n?S@hS=4z3N33L+t3HU9!G%m?k=-6yaT@6FgXz?PgN57zVTMkNSgPBGf8s&Jz=_7!C4#Mngu?NY8k^NhNjTewZEB-LP_-+f=#ZwPZ&ze_8R97yr42Z6Vkj&";
    private static Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY.getBytes());
    private static JWTVerifier jwtVerifier = JWT.require(algorithm).build();

    public static String generate_token(HttpServletRequest request, User authUser, long time) {
        return JWT.create()
                .withSubject(authUser.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + time))
                .withIssuer(request.getRequestURL().toString())
                .withClaim("roles", authUser.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);
    }

    public static String generate_token(HttpServletRequest request, AppUser user, long time) {
        return JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + time))
                .withIssuer(request.getRequestURL().toString())
                .withClaim("roles", user.getRoles().stream().map(Role::name).collect(Collectors.toList()))
                .sign(algorithm);
    }

    public static DecodedJWT decode_token(String token) {
        DecodedJWT decodedJWT = jwtVerifier.verify(token);

        return decodedJWT;
    }
}
