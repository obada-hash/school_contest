package com.obada.ezz_contest.dto;


import com.obada.ezz_contest.base.dto.BaseDto;
import com.obada.ezz_contest.entity.Role;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class AppUserDto extends BaseDto<Long> {

    private Long id;
    private String name;
    private String email;
}
