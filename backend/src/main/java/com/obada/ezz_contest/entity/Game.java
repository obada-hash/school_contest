package com.obada.ezz_contest.entity;

import com.obada.ezz_contest.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "games")
@Getter
@Setter
public class Game extends BaseEntity<Long> {

    private String name;

    @ManyToOne
    private AppUser appUser;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Category> categories = new HashSet<>();

}
