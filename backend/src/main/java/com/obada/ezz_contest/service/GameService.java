package com.obada.ezz_contest.service;

import com.obada.ezz_contest.base.service.BaseService;
import com.obada.ezz_contest.dto.CreateGameDto;
import com.obada.ezz_contest.entity.AppUser;
import com.obada.ezz_contest.entity.Category;
import com.obada.ezz_contest.entity.Game;
import com.obada.ezz_contest.entity.Question;
import com.obada.ezz_contest.mapper.GameMapper;
import com.obada.ezz_contest.repository.GameRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class GameService extends BaseService<Game, Long> {

    private final GameRepository gameRepository;
    private final GameMapper gameMapper;

    public GameService(GameRepository gameRepository, GameMapper gameMapper) {
        super(gameRepository); // Pass to BaseService
        this.gameRepository = gameRepository;
        this.gameMapper = gameMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Game findById(Long id) {
        Game game = gameRepository.findFullById(id).orElse(null);
        if (game == null) return null;

        AppUser currentUser = getCurrentUser();
        if (isAdmin(currentUser)) return game;

        if (!game.getAppUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You do not own this game.");
        }

        return game;
    }

    @Transactional(readOnly = true)
    public List<Game> findAllWithUser() {
        AppUser currentUser = getCurrentUser();

        if (isAdmin(currentUser)) {
            return gameRepository.findAllWithUser(); // Admin sees everything
        } else {
            return gameRepository.findAllByAppUser_Id(currentUser.getId()); // User sees only their games
        }
    }

    @Transactional
    public Game createGame(CreateGameDto dto) {
        AppUser currentUser = getCurrentUser();

        Game game = gameMapper.toEntity(dto);
        game.setAppUser(currentUser); // Securely assign the logged-in user

        return gameRepository.save(game);
    }

    @Transactional
    public Game updateGame(Long id, CreateGameDto dto) {
        // 1. Fetch the game (this automatically checks ownership/Admin via your findById logic)
        Game existingGame = findById(id);
        if (existingGame == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found");
        }

        // 2. Convert incoming DTO to entities
        Game mappedGame = gameMapper.toEntity(dto);

        // 3. Update the game name (AppUser and ID remain untouched)
        existingGame.setName(mappedGame.getName());

        // 4. Clear old categories and insert the updated ones into the managed Set
        existingGame.getCategories().clear();
        if (mappedGame.getCategories() != null) {
            for (Category category : mappedGame.getCategories()) {
                category.setId(null); // Ensures clean insert even if the JSON included old IDs
                category.setGame(existingGame);
                if (category.getQuestions() != null) {
                    for (Question question : category.getQuestions()) {
                        question.setId(null);
                        question.setCategory(category);
                    }
                }
                existingGame.getCategories().add(category);
            }
        }

        return gameRepository.save(existingGame);
    }

    @Transactional
    public void deleteGame(Long id) {
        // Fetches the game and enforces the Owner/Admin security check
        Game existingGame = findById(id);
        if (existingGame == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found");
        }

        // CascadeType.ALL automatically deletes all related Categories and Questions
        gameRepository.delete(existingGame);
    }

    // --- Private Security Helpers ---
    private AppUser getCurrentUser() {
        return (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private boolean isAdmin(AppUser user) {
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }
}