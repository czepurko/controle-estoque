package com.estoque;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.transaction.Transactional;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @GET
    public List<Product> listar() {
        return Product.listAll();
    }

    @POST
    @Transactional
    public Product criar(Product product) {
        product.persist();
        return product;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Product atualizar(@PathParam("id") Long id, Product dados) {
        Product product = Product.findById(id);

        if (product == null) {
            throw new NotFoundException("Product not found");
        }

        product.name = dados.name;
        product.amount = dados.amount;
        product.price = dados.price;

        return product;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void deletar(@PathParam("id") Long id) {
        boolean removido = Product.deleteById(id);

        if (!removido) {
            throw new NotFoundException("Product not found");
        }
    }
}
