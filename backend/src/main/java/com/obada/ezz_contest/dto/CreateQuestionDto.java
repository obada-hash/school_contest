package com.obada.ezz_contest.dto;

import com.obada.ezz_contest.base.dto.BaseDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateQuestionDto extends BaseDto<Long> {

    @NotBlank(message = "Question cannot be empty")
    private String question;

    @NotBlank(message = "Answer cannot be empty")
    private String answer;

    @NotNull(message = "Score is required")
    @Min(value = 1, message = "Score must be at least 1")
    private Integer score;

}