package team.cryptonians.Scheduler.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    //TODO: key should not be here
    private static final String SECRETE_KEY = "satyamsagarprasadsatyamsagarprasad";

    public String generateToken(String username) {
        Map<String,Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000*60*60*48))  //2 days validation
                .signWith(getKey())
                .compact();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRETE_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
