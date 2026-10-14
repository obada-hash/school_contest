package com.obada.ezz_contest.repository;


import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.entity.Question;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends BaseRepository<Question, Long> {

    List<Question> findAllByCategory_Game_AppUser_Id(Long userId);
}
