package com.voyajoy.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.voyajoy.backend.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFound(
			ResourceNotFoundException ex, WebRequest request){
		
		ErrorResponse response = new ErrorResponse(
		HttpStatus.NOT_FOUND.value(),
		"INVALID INPUT",
		ex.getMessage(),
		request.getDescription(false).replace("uri=",""));
		
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ErrorResponse> handleUnauthorizeException(
			UnauthorizedException ex, WebRequest request){
		
		ErrorResponse response  = new ErrorResponse(
				
				HttpStatus.UNAUTHORIZED.value(),
				"UNAUTHORIZED",
				ex.getMessage(),
				request.getDescription(false).replace("uri=","")
				);
		
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);		
	}
	
	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<ErrorResponse> handleDuplicateResourceException(
			                       DuplicateResourceException ex, WebRequest request){
		
		ErrorResponse response = new ErrorResponse(
				HttpStatus.CONFLICT.value(),
				"DUPLICATE_RESOURCE",
				ex.getMessage(),
				request.getDescription(false).replace("uri=","")				
				);
		
			return 	new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(InvalidInputException.class)
	public ResponseEntity<ErrorResponse> handleInavlidInputException(
			           InvalidInputException ex, WebRequest request){
		
		
		ErrorResponse response = new ErrorResponse(
				HttpStatus.BAD_REQUEST.value(),
				"INVALID INPUT",
				ex.getMessage(),
				request.getDescription(false).replace("uri=", "")
				);
		
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		
	}
	
	
	 @ExceptionHandler(Exception.class)
	    public ResponseEntity<ErrorResponse> handleGlobalException(
	            Exception ex, 
	            WebRequest request) {
	        
	        ErrorResponse errorResponse = new ErrorResponse(
	            HttpStatus.INTERNAL_SERVER_ERROR.value(),
	            "INTERNAL_SERVER_ERROR",
	            "An unexpected error occurred: " + ex.getMessage(),
	            request.getDescription(false).replace("uri=", "")
	        );
	        
	        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	 }	
	 
}
