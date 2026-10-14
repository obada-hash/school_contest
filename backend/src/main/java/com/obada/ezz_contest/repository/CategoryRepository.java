package com.obada.ezz_contest.repository;


import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.entity.Category;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends BaseRepository<Category, Long> {

    Category findByName(String name);
}
