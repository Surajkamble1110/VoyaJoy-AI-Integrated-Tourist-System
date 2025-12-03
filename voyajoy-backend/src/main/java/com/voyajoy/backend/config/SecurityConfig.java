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
				.requestMatchers("/voyajoy/api/auth/register", "/voyajoy/api/auth/login").permitAll()
				.requestMatchers("/voyajoy/api/destination/all-destinations",
						          "/voyajoy/api/destination/profile/**",
						          "/voyajoy/api/destination/by-name/**",
						          "/voyajoy/api/destination/by-location/**",
						          "/voyajoy/api/destination/by-range/**").permitAll()
				
				//CUSTOMER ROLE 
				.requestMatchers("/voyajoy/api/booking/**").hasRole("CUSTOMER")
				.requestMatchers("/voyajoy/api/payment/create",
						         "/voyajoy/api/payment/my-payments").hasRole("CUSTOMER")
				
				//CUSTOMER ND manager
				.requestMatchers("/voyajoy/api/user/**").hasAnyRole("CUSTOMER", "MANAGER")
				
				
				//MANAGER ROLE
				.requestMatchers("/voyajoy/api/manager/**").hasRole("MANAGER")
				.requestMatchers("/voyajoy/api/destination/add-destination",
				  "/voyajoy/api/destination/update-destination/**",
				 "/voyajoy/api/destination/delete-destination/**").hasRole("MANAGER")
				.requestMatchers("/voyajoy/api/payments/all", 
		                 "/voyajoy/api/payments/status/**",
		                 "/voyajoy/api/payments/revenue/**").hasRole("MANAGER")
				
				.anyRequest().authenticated()
		)
		
		.sessionManagement(session-> 
		session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).
		
		addFilterBefore(jwtFilter,UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
				
	   }
}