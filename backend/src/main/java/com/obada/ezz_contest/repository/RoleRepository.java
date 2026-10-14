package com.obada.ezz_contest.repository;


import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.entity.AppUser;
import com.obada.ezz_contest.entity.Role;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends BaseRepository<Role, Long> {

    Optional<Role> findByName(String name);
}
