package com.obada.ezz_contest.base.mapper;

import org.mapstruct.MappingTarget;

import java.util.List;

public interface BaseMapper<E, D> {

    E toEntity(D dto);

    D toDto(E entity);

    List<E> toEntity(List<D> dtoList);

    List<D> toDto(List<E> entityList);

    // Takes fields from the DTO and updates the existing Entity instance
    void updateEntityFromDto(D dto, @MappingTarget E entity);
}