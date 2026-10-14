package com.obada.ezz_contest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.obada.ezz_contest.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity<Long> {

    private String name;

    @ManyToOne
    @JsonIgnore
    private Game game;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Question> questions = new HashSet<>();

}
