package com.obada.ezz_contest.entity;


import com.obada.ezz_contest.base.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role extends BaseEntity<Long> {

    private String name;
}
