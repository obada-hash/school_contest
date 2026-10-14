package com.obada.ezz_contest.service;

import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.base.service.BaseService;
import com.obada.ezz_contest.entity.Category;
import com.obada.ezz_contest.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CategoryService extends BaseService<Category, Long> {

    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryService(BaseRepository<Category, Long> baseRepository) {
        super(baseRepository);
    }

    public Category findByName(String name){
        return categoryRepository.findByName(name);
    }
}
