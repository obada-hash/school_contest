package com.obada.ezz_contest.dto;


import com.obada.ezz_contest.entity.AppUser;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GameDto {

    private Long id;
    private String name;
    private AppUserDto appUser;
    private List<CategoryDto> categories;
}
