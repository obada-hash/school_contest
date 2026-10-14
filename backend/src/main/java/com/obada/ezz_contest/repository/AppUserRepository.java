package com.obada.ezz_contest.repository;


import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.entity.AppUser;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends BaseRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);
}
