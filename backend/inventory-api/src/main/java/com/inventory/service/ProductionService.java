package com.inventory.service;

import com.estoque.Product;
import com.estoque.ProductMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.*;

@ApplicationScoped
public class ProductionService {

    @Inject
    EntityManager em;

    public List<Map<String, Object>> calculateProduction() {

        List<Product> products = em
                .createQuery("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.materials", Product.class)
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Product product : products) {

            List<ProductMaterial> relations = product.materials;

            int maxProduction;

            if (relations == null || relations.isEmpty()) {
                maxProduction = 0;
            } else {
                maxProduction = Integer.MAX_VALUE;
                for (ProductMaterial r : relations) {

                    if (r.rawMaterial != null && r.requiredQuantity != null) {
                        int stock = r.rawMaterial.stockQuantity;
                        int required = r.requiredQuantity;

                        int possible = (required > 0) ? (stock / required) : 0;
                        maxProduction = Math.min(maxProduction, possible);
                    }
                }
            }

            Map<String, Object> item = new HashMap<>();
            item.put("product", product.name);
            item.put("canProduce", maxProduction == Integer.MAX_VALUE ? 0 : maxProduction);

            result.add(item);
        }

        return result;
    }
}