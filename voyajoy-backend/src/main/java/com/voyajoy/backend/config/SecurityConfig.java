package com.voyajoy.backend.config;

import com.voyajoy.backend.util.JwtFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration 
@EnableMethodSecurity
public class SecurityConfig {
 	
    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

	
	@Bean
	public PasswordEncoder getPasswordEncoder() {
		
		return new BCryptPasswordEncoder();		
	}
	
	
	@Bean 
	public SecurityFilterChain securityFilterChain(HttpSecurity http) 
	throws Exception{
	 
		http .csrf(csrf -> csrf.disable()) 
		.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
				.requestMatchers("/api/destination/all-destinations",
						          "/api/destination/profile/**",
						          "/api/destination/by-name/**",
						          "/api/destination/by-location/**",
						          "/api/destination/by-range/**").permitAll()
				
				//CUSTOMER ROLE 
				.requestMatchers("/api/booking/**").hasRole("CUSTOMER")
				.requestMatchers("/api/payment/create",
						         "/api/payment/my-payments").hasRole("CUSTOMER")
				
				//CUSTOMER ND manager
				.requestMatchers("/api/user/**").hasAnyRole("CUSTOMER", "MANAGER")
				
				
				//MANAGER ROLE
				.requestMatchers("/api/manager/**").hasRole("MANAGER")
				.requestMatchers("/api/destination/add-destination",
				  "/api/destination/update-destination/**",
				 "/api/destination/delete-destination/**").hasRole("MANAGER")
				.requestMatchers("/api/payments/all", 
		                 "/api/payments/status/**",
		                 "/api/payments/revenue/**").hasRole("MANAGER")
				
				.anyRequest().authenticated()
		)
		
		.sessionManagement(session-> 
		session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).
		
		addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
				
	   }
}