package com.obada.ezz_contest.service;

import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.base.service.BaseService;
import com.obada.ezz_contest.entity.AppUser;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

@Service
public class AppUserService extends BaseService<AppUser, Long> {

    public AppUserService(BaseRepository<AppUser, Long> baseRepository) {
        super(baseRepository);
    }
}
