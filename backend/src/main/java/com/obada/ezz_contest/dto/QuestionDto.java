// Fixed QuestionDto.java
package com.obada.ezz_contest.dto;

import com.obada.ezz_contest.base.dto.BaseDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionDto extends BaseDto<Long> {

    private String question;
    private String answer;
    private Integer score;
}