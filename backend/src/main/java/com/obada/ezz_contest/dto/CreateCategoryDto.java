package com.obada.ezz_contest.dto;


import com.obada.ezz_contest.base.dto.BaseDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateCategoryDto extends BaseDto<Long> {

    @NotBlank(message = "Category name cannot be empty")
    private String name;

    @NotEmpty(message = "A category must contain at least one question")
    @Valid // Triggers validation inside CreateQuestionDto
    private List<CreateQuestionDto> questions;
}
