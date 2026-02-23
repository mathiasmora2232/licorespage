package com.ventas.productos.dto;

import com.ventas.productos.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String roles;
    private String createdAt;

    public static UserResponse fromUser(User user) {
        UserResponse ur = new UserResponse();
        ur.setId(user.getId());
        ur.setEmail(user.getEmail());
        ur.setName(user.getName());
        ur.setRoles(user.getRoles());
        if (user.getCreatedAt() != null) ur.setCreatedAt(user.getCreatedAt().toString());
        return ur;
    }
}
