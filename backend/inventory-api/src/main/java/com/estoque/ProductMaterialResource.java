package com.estoque;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.transaction.Transactional;
import java.util.List;

@Path("/product-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductMaterialResource {

    @GET
    public List<ProductMaterial> list() {
        return ProductMaterial.listAll();
    }

    @POST
    @Transactional
    public void create(ProductMaterial pm) {
        pm.persist();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        ProductMaterial.deleteById(id);
    }
}
