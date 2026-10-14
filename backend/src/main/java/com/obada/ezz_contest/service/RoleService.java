package com.obada.ezz_contest.service;


import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.base.service.BaseService;
import com.obada.ezz_contest.entity.Role;
import org.springframework.stereotype.Service;

@Service
public class RoleService extends BaseService<Role, Long> {

    public RoleService(BaseRepository<Role, Long> baseRepository) {
        super(baseRepository);
    }
}
