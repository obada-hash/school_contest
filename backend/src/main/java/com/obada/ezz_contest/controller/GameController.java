package com.obada.ezz_contest.controller;

import com.obada.ezz_contest.dto.CreateGameDto;
import com.obada.ezz_contest.dto.GameDto;
import com.obada.ezz_contest.dto.GameSummaryDto;
import com.obada.ezz_contest.entity.Game;
import com.obada.ezz_contest.mapper.GameMapper;
import com.obada.ezz_contest.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/game")
public class GameController {

    private final GameService gameService;
    private final GameMapper gameMapper;

    @GetMapping("/{id}")
    public ResponseEntity<GameDto> getGameById(@PathVariable Long id) {
        Game game = gameService.findById(id);
        if (game == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        GameDto dto = gameMapper.toDto(game);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<GameSummaryDto>> getAllGames() {
        List<GameSummaryDto> dtos = gameMapper.toSummaryDto(gameService.findAllWithUser());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<GameDto> createGame(
            @Valid @RequestBody CreateGameDto createGameDto) {
        Game game = gameService.createGame(createGameDto);
        GameDto dto = gameMapper.toDto(game);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameDto> updateGame(
            @PathVariable Long id,
            @Valid @RequestBody CreateGameDto updateGameDto
    ) {
        Game updatedGame = gameService.updateGame(id, updateGameDto);
        GameDto dto = gameMapper.toDto(updatedGame);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}