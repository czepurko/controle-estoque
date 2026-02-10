package com.estoque;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class ProductMaterial extends PanacheEntity {

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference // Evita recursão infinita no JSON ao listar produtos
    public Product product;

    @ManyToOne
    @JoinColumn(name = "raw_material_id")
    public RawMaterial rawMaterial;

    public Integer requiredQuantity;
}
