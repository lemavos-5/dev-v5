package tech.lemnova.continuum.infra.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tech.lemnova.continuum.domain.token.TokenBlacklistRepository;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService userDetailsService, 
                        TokenBlacklistRepository tokenBlacklistRepository) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req,
                                    @NonNull HttpServletResponse res,
                                    @NonNull FilterChain chain)
            throws ServletException, IOException {

        String path = req.getServletPath();
        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui") || path.equals("/error")) {
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        try {
            String token = header.substring(7);
            
            // Verificar se o token é válido
            if (!jwtService.isValid(token)) {
                log.warn("JWT token expired or invalid");
                chain.doFilter(req, res);
                return;
            }

            // Verificar se é um Access Token (não Refresh Token)
            if (!jwtService.isAccessToken(token)) {
                log.warn("JWT token is not an access token");
                chain.doFilter(req, res);
                return;
            }

            // Verificar se o token está na blacklist (revogado)
            String jti = jwtService.extractJti(token);
            if (jti != null && tokenBlacklistRepository.findByJti(jti).isPresent()) {
                log.warn("JWT token is blacklisted (revoked)");
                chain.doFilter(req, res);
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                String username = jwtService.extractUsername(token);
                UserDetails ud = userDetailsService.loadUserByUsername(username);
                var auth = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
            log.warn("JWT validation failed: {}", e.getMessage());
        }

        chain.doFilter(req, res);
    }
}

