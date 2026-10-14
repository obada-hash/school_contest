// Fixed GameSummaryDto.java
package com.obada.ezz_contest.dto;

import com.obada.ezz_contest.base.dto.BaseDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameSummaryDto extends BaseDto<Long> {
    private String name;
    private AppUserDto appUser;
}