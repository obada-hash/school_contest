package com.obada.ezz_contest.base.repository;

import com.obada.ezz_contest.base.entity.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;


// this is important so spring don't think that this is a repo and try to make baseEntity
// an entity
@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity<ID>, ID extends Serializable> extends JpaRepository<T, ID> {
}
