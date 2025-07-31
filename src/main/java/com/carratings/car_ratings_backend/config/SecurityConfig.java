package com.carratings.car_ratings_backend.config;

import com.carratings.car_ratings_backend.user.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    private final AuthenticationSuccessHandler customAuthenticationSuccessHandler;

    public SecurityConfig(AuthenticationSuccessHandler customAuthenticationSuccessHandler) {
        this.customAuthenticationSuccessHandler = customAuthenticationSuccessHandler;
    }

    // --- NEW: This makes /welcome.html the default page for the root URL ---
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/welcome.html");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http,
            PasswordEncoder passwordEncoder,
            CustomUserDetailsService userDetailsService
    ) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
        return auth.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/api/cars", "/api/cars/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/cars/**").hasRole("ADMIN")
                .requestMatchers("/admin.html", "/admin.js").hasRole("ADMIN")
                .requestMatchers("/api/rating-types/**", "/api/reviews/**").hasAnyRole("USER", "ADMIN")
                
                // --- UPDATED: Add /welcome.html to the list of permitted public pages ---
                .requestMatchers("/", "/welcome.html", "/auth/**", "/login.html", "/register.html",
                 "/*.css", "/*.js", "/review.html", "/review.js",
                 "/images/welcome.jpg").permitAll()

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login.html")
                .loginProcessingUrl("/login")
                .successHandler(customAuthenticationSuccessHandler) // This correctly redirects to /index.html or /admin.html
                .failureUrl("/login.html?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                // --- UPDATED: Redirect to the new welcome page after logout ---
                .logoutSuccessUrl("/welcome.html?logout")
                .permitAll()
            );

        return http.build();
    }
}
