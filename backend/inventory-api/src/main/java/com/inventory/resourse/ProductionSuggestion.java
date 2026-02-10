package com.inventory.resourse;

public class ProductionSuggestion {

    public String productName;
    public int quantityPossible;
    public double totalValue;

    public ProductionSuggestion(String productName, int quantityPossible, double totalValue) {
        this.productName = productName;
        this.quantityPossible = quantityPossible;
        this.totalValue = totalValue;
    }
}
