package com.obada.ezz_contest.repository;

import com.obada.ezz_contest.base.repository.BaseRepository;
import com.obada.ezz_contest.entity.Game;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends BaseRepository<Game, Long> {

    @EntityGraph(attributePaths = {"categories", "categories.questions"})
    @Query("select g from Game g where g.id = :id")
    Optional<Game> findFullById(@Param("id") Long id);

    @Query("select g from Game g")
    List<Game> findAllWithUser();

    List<Game> findAllByAppUser_Id(Long userId);
}
