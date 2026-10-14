package com.obada.ezz_contest.dto;


import com.obada.ezz_contest.base.dto.BaseDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateGameDto extends BaseDto<Long> {

    @NotBlank(message = "Game name cannot be empty")
    private String name;

    @NotNull(message = "Categories list cannot be null")
    @Size(min = 3, max = 4, message = "A game must hold between 3 and 4 categories only")
    @Valid // CRITICAL: Tells Spring to also validate the CreateCategoryDto objects inside this list
    private List<CreateCategoryDto> categories;
}
