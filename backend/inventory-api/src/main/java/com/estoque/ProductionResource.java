package com.estoque;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.transaction.Transactional;
import java.util.*;

@Path("/production")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductionResource {

    @GET
    public List<ProductionSuggestion> suggest() {
        List<Product> products = Product.listAll();
        List<ProductionSuggestion> result = new ArrayList<>();

        for (Product product : products) {
            List<ProductMaterial> materials = ProductMaterial.list("product", product);
            if (materials.isEmpty())
                continue;

            int maxProduction = Integer.MAX_VALUE;

            for (ProductMaterial pm : materials) {
                if (pm.requiredQuantity == null || pm.requiredQuantity == 0)
                    continue;
                int stock = (pm.rawMaterial.stockQuantity != null) ? pm.rawMaterial.stockQuantity : 0;
                int possible = stock / pm.requiredQuantity;
                maxProduction = Math.min(maxProduction, possible);
            }

            if (maxProduction > 0 && maxProduction != Integer.MAX_VALUE) {
                double totalValue = maxProduction * product.price;
                result.add(new ProductionSuggestion(product.name, maxProduction, totalValue));
            }
        }
        // Ordenação corrigida (acesso direto ao campo, sem parênteses)
        result.sort((a, b) -> Double.compare(b.totalValue, a.totalValue));
        return result;
    }

    @POST
    @Path("/execute")
    @Transactional
    public String execute(ProductionRequest request) {
        if (request == null || request.productId == null || request.quantity == null || request.quantity <= 0) {
            throw new BadRequestException("Invalid production request");
        }

        Product product = Product.findById(request.productId);
        if (product == null)
            throw new NotFoundException("Product not found");

        List<ProductMaterial> materials = ProductMaterial.list("product", product);

        // 1. Verificar estoque (acesso direto ao campo request.quantity)
        for (ProductMaterial pm : materials) {
            int needed = pm.requiredQuantity * request.quantity;
            if (pm.rawMaterial.stockQuantity < needed) {
                throw new BadRequestException("Insufficient stock for: " + pm.rawMaterial.name);
            }
        }

        // 2. Descontar estoque
        for (ProductMaterial pm : materials) {
            pm.rawMaterial.stockQuantity -= (pm.requiredQuantity * request.quantity);
        }

        return "Production executed successfully";
    }

    @GET
    @Path("/summary")
    public Map<String, Object> summary() {
        List<ProductionSuggestion> suggestions = suggest();
        double totalValue = 0;
        int totalUnits = 0;

        for (ProductionSuggestion s : suggestions) {
            totalValue += s.totalValue;
            totalUnits += s.quantityPossible;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalUnitsPossible", totalUnits);
        result.put("totalProductionValue", totalValue);
        return result;
    }
}

// Classes auxiliares (DTOs) sem parênteses nos campos
class ProductionSuggestion {
    public String product;
    public int quantityPossible;
    public double totalValue;

    public ProductionSuggestion(String product, int quantityPossible, double totalValue) {
        this.product = product;
        this.quantityPossible = quantityPossible;
        this.totalValue = totalValue;
    }
}

class ProductionRequest {
    public Long productId;
    public Integer quantity;
}