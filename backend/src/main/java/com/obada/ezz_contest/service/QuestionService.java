package com.obada.ezz_contest.service;

import com.obada.ezz_contest.base.service.BaseService;
import com.obada.ezz_contest.entity.AppUser;
import com.obada.ezz_contest.entity.Question;
import com.obada.ezz_contest.repository.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class QuestionService extends BaseService<Question, Long> {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        // Pass to BaseService so generic CRUD methods still work
        super(questionRepository);
        // Save locally so we can call custom methods like findAllByCategory_Game_AppUser_Id
        this.questionRepository = questionRepository;
    }

    @Override
    public List<Question> findAll() {
        AppUser currentUser = getCurrentUser();

        // 1. If Admin, call the BaseService logic to return everything
        if (isAdmin(currentUser)) {
            return super.findAll();
        }

        // 2. If normal User, filter using our custom repository method
        return questionRepository.findAllByCategory_Game_AppUser_Id(currentUser.getId());
    }

    @Override
    public Question findById(Long id) {
        // Fetch it using the generic logic first
        Question question = super.findById(id);

        if (question == null) {
            return null;
        }

        AppUser currentUser = getCurrentUser();
        if (isAdmin(currentUser)) {
            return question;
        }

        // Verify ownership: Question -> Category -> Game -> User
        Long ownerId = question.getCategory().getGame().getAppUser().getId();
        if (!ownerId.equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You do not own this question.");
        }

        return question;
    }

    @Override
    public void deleteById(Long id) {
        // Calling our overridden findById automatically runs the ownership check above.
        // It throws a 403 Forbidden if they don't own it.
        findById(id);

        // If it passes, proceed with standard deletion
        super.deleteById(id);
    }

    @Override
    public Question update(Question entity) {
        // Same here, verify ownership before allowing an update to proceed
        findById(entity.getId());
        return super.update(entity);
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