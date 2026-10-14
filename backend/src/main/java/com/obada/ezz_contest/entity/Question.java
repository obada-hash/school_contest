package com.obada.ezz_contest.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.obada.ezz_contest.base.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "game_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question extends BaseEntity<Long> {

    private String question;
    private String answer;
    private Integer score;

    @ManyToOne
    @JsonIgnore
    private Category category;
}
