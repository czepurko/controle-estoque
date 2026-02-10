package com.estoque;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.transaction.Transactional;
import java.util.List;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> list() {
        return RawMaterial.listAll();
    }

    @POST
    @Transactional
    public RawMaterial create(RawMaterial material) {
        material.persist();
        return material;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial data) {
        RawMaterial material = RawMaterial.findById(id);

        if (material == null) {
            throw new NotFoundException("Raw material not found");
        }

        material.name = data.name;
        material.stockQuantity = data.stockQuantity;

        return material;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        boolean removed = RawMaterial.deleteById(id);

        if (!removed) {
            throw new NotFoundException("Raw material not found");
        }
    }
}
