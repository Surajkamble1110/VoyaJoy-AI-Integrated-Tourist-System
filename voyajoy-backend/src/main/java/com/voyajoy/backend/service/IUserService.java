package com.voyajoy.backend.service;

import java.util.List;

import com.voyajoy.backend.dto.LoginRequest;
import com.voyajoy.backend.dto.RegisterRequest;
import com.voyajoy.backend.entity.User;

public interface IUserService {

	  User registerUser(RegisterRequest request);
      User loginUser(LoginRequest request);
      User getUserById(Long id);
      List<User> getAllCustomers();
      List<User> getAllUsers();
      Long getTotalUsersCount();
}
