package com.obada.ezz_contest.mapper;


import com.obada.ezz_contest.base.mapper.BaseMapper;
import com.obada.ezz_contest.dto.CreateGameDto;
import com.obada.ezz_contest.dto.GameDto;
import com.obada.ezz_contest.dto.GameSummaryDto;
import com.obada.ezz_contest.entity.Category;
import com.obada.ezz_contest.entity.Game;
import com.obada.ezz_contest.entity.Question;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GameMapper extends BaseMapper<Game, GameDto> {


    List<GameSummaryDto> toSummaryDto(List<Game> games);

    Game toEntity(CreateGameDto dto);

    @AfterMapping
    default void linkParents(@MappingTarget Game game) {
        if (game.getCategories() == null) return;
        for (Category category : game.getCategories()) {
            category.setGame(game);
            if (category.getQuestions() == null) continue;
            for (Question question : category.getQuestions()) {
                question.setCategory(category);
            }
        }
    }

}
