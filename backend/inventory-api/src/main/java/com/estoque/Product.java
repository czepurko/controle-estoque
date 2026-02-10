package com.estoque;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import java.util.List;
import java.util.ArrayList;

@Entity
public class Product extends PanacheEntity {

    public String name;
    public int amount;
    public double price;

    // Adicionamos a relação para que o ProductionService consiga acessar os
    // materiais
    // mappedBy deve ser o nome do campo "product" dentro da classe ProductMaterial
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<ProductMaterial> materials = new ArrayList<>();
}