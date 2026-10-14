package com.obada.ezz_contest.mapper;

import com.obada.ezz_contest.base.mapper.BaseMapper;
import com.obada.ezz_contest.dto.QuestionDto;
import com.obada.ezz_contest.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface QuestionMapper extends BaseMapper<Question, QuestionDto> {
}
