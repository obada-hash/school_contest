package com.obada.ezz_contest.mapper;

import com.obada.ezz_contest.base.mapper.BaseMapper;
import com.obada.ezz_contest.dto.CategoryDto;
import com.obada.ezz_contest.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper extends BaseMapper<Category, CategoryDto> {
}
