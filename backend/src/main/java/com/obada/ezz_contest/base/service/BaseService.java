package com.obada.ezz_contest.base.service;

import com.obada.ezz_contest.base.entity.BaseEntity;
import com.obada.ezz_contest.base.repository.BaseRepository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;


public abstract class BaseService<T extends BaseEntity<ID>, ID extends Serializable> {

    protected BaseRepository<T, ID> baseRepository;

    public BaseService(BaseRepository<T, ID> baseRepository) {
        this.baseRepository = baseRepository;
    }

    @Transactional(readOnly = true)
    public List<T> findAll() {
        return baseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public T findById(ID id) {
        return baseRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public T getOne(ID id) {
        return baseRepository.getReferenceById(id);
    }

    @Transactional(readOnly = true)
    public Optional<T> getById(ID id) {
        return baseRepository.findById(id);
    }

    @Transactional
    public T insert(T entity) {
        return baseRepository.save(entity);
    }

    @Transactional
    public T persist(T entity) {
        return baseRepository.saveAndFlush(entity);
    }

    @Transactional
    public T update(T entity) {
        return baseRepository.save(entity);
    }

    @Transactional
    public void deleteById(ID id) {
        baseRepository.deleteById(id);
    }

    @Transactional
    public void deleteAll(List<ID> ids) {
        baseRepository.deleteAllById(ids);
    }
}