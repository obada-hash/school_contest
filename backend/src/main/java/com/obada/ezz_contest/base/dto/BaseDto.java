package com.obada.ezz_contest.base.dto;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public abstract class BaseDto<ID extends Serializable> {
    private ID id;
}
