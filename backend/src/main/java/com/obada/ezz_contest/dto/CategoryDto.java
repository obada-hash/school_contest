package com.obada.ezz_contest.dto;


import com.obada.ezz_contest.base.dto.BaseDto;
import com.obada.ezz_contest.entity.Game;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryDto extends BaseDto<Long> {

    private String name;
    private List<QuestionDto> questions;

}
