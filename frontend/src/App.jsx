import { useEffect, useState, useCallback } from "react";

function App() {
  const API_BASE = "https://controle-estoque-7y3q.onrender.com";
  const PRODUCT_API = `${API_BASE}/products`;
  const MATERIAL_API = `${API_BASE}/raw-materials`;
  const PM_API = `${API_BASE}/product-materials`;
  const PRODUCTION_API = `${API_BASE}/inventory`;

  const [production, setProduction] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [relations, setRelations] = useState([]);

  // Estados dos formulários
  const [pName, setPName] = useState("");
  const [pAmount, setPAmount] = useState("");
  const [pPrice, setPPrice] = useState("");

  const [mName, setMName] = useState("");
  const [mStock, setMStock] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [requiredQty, setRequiredQty] = useState("");

  // ---------- FUNÇÕES DE CARREGAMENTO ----------

  const loadProducts = useCallback(async () => {
    const res = await fetch(PRODUCT_API);
    setProducts(await res.json());
  }, [PRODUCT_API]);

  const loadMaterials = useCallback(async () => {
    const res = await fetch(MATERIAL_API);
    setMaterials(await res.json());
  }, [MATERIAL_API]);

  const loadRelations = useCallback(async () => {
    const res = await fetch(PM_API);
    setRelations(await res.json());
  }, [PM_API]);

  const loadProduction = async () => {
    try {
      const res = await fetch(PRODUCTION_API);
      const data = await res.json();
      setProduction(data);
    } catch (err) {
      console.error("Erro ao calcular produção:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadProducts(), loadMaterials(), loadRelations()]);
    };
    init();
  }, [loadProducts, loadMaterials, loadRelations]);

  // ---------- CRUDS ----------

  const createProduct = async () => {
    if (!pName || !pAmount || !pPrice)
      return alert("Preencha todos os campos do produto");

    await fetch(PRODUCT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: pName,
        amount: Number(pAmount),
        price: Number(pPrice),
      }),
    });

    setPName("");
    setPAmount("");
    setPPrice("");
    loadProducts();
    setProduction([]);
  };

  const deleteProduct = async (id) => {
    await fetch(`${PRODUCT_API}/${id}`, { method: "DELETE" });
    loadProducts();
    setProduction([]);
  };

  const createMaterial = async () => {
    if (!mName || !mStock) return alert("Preencha os campos do material");

    await fetch(MATERIAL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: mName,
        stockQuantity: Number(mStock),
      }),
    });

    setMName("");
    setMStock("");
    loadMaterials();
    setProduction([]);
  };

  const deleteMaterial = async (id) => {
    await fetch(`${MATERIAL_API}/${id}`, { method: "DELETE" });
    loadMaterials();
    setProduction([]);
  };

  const createRelation = async () => {
    if (!selectedProduct || !selectedMaterial || !requiredQty) {
      return alert("Selecione produto, material e quantidade");
    }

    await fetch(PM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: { id: Number(selectedProduct) },
        rawMaterial: { id: Number(selectedMaterial) },
        requiredQuantity: Number(requiredQty),
      }),
    });

    setSelectedProduct("");
    setSelectedMaterial("");
    setRequiredQty("");
    loadRelations();
    setProduction([]);
  };

  const deleteRelation = async (id) => {
    await fetch(`${PM_API}/${id}`, { method: "DELETE" });
    loadRelations();
    setProduction([]);
  };

  // ---------- ESTILOS RESPONSIVOS ----------

  const containerStyle = {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    fontSize: "18px",
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#1e1e1e",
    color: "#f5f5f5",
  };

  const formRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "10px",
  };

  const inputStyle = {
    flex: "1 1 180px",
    minWidth: "140px",
    padding: "8px",
  };

  const buttonStyle = {
    flex: "1 1 180px",
    minWidth: "140px",
    padding: "12px",
    backgroundColor: "#555",
    color: "#f5f5f5",
    border: "1px solid #666",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", color: "#ffffff", fontSize: "2.2rem" }}>
        Inventory & Production System
      </h1>
      <hr />

      {/* SEÇÃO DE PRODUTOS */}
      <section>
        <h2>Products</h2>
        <div style={formRowStyle}>
          <input
            style={inputStyle}
            placeholder="Name"
            value={pName}
            onChange={(e) => setPName(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Amount"
            type="number"
            value={pAmount}
            onChange={(e) => setPAmount(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Price"
            type="number"
            value={pPrice}
            onChange={(e) => setPPrice(e.target.value)}
          />
          <button style={buttonStyle} onClick={createProduct}>
            Add Product
          </button>
        </div>
        <ul>
          {products.map((p) => (
            <li key={p.id} style={{ marginBottom: "5px" }}>
              <strong>{p.name}</strong> — Qtd: {p.amount} — ${p.price}
              <button
                onClick={() => deleteProduct(p.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* SEÇÃO DE MATERIAIS */}
      <section>
        <h2>Raw Materials</h2>
        <div style={formRowStyle}>
          <input
            style={inputStyle}
            placeholder="Material Name"
            value={mName}
            onChange={(e) => setMName(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Stock"
            type="number"
            value={mStock}
            onChange={(e) => setMStock(e.target.value)}
          />
          <button style={buttonStyle} onClick={createMaterial}>
            Add Material
          </button>
        </div>
        <ul>
          {materials.map((m) => (
            <li key={m.id} style={{ marginBottom: "5px" }}>
              {m.name} — Stock: {m.stockQuantity}
              <button
                onClick={() => deleteMaterial(m.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* SEÇÃO DE RECEITAS */}
      <section>
        <h2>Product Composition (Recipes)</h2>
        <div style={formRowStyle}>
          <select
            style={inputStyle}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            style={inputStyle}
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">Select material</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            style={inputStyle}
            placeholder="Qty needed"
            type="number"
            value={requiredQty}
            onChange={(e) => setRequiredQty(e.target.value)}
          />
          <button style={buttonStyle} onClick={createRelation}>
            Link Material
          </button>
        </div>
        <ul>
          {relations.map((r) => (
            <li key={r.id} style={{ marginBottom: "5px" }}>
              {r.product?.name} requires {r.requiredQuantity}x{" "}
              {r.rawMaterial?.name}
              <button
                onClick={() => deleteRelation(r.id)}
                style={{ marginLeft: "10px" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* SEÇÃO DE CAPACIDADE DE PRODUÇÃO */}
      <section
        style={{
          backgroundColor: "#2a2a2a",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <h2>Production Capacity</h2>
        <button
          onClick={loadProduction}
          style={{
            padding: "12px",
            width: "100%",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Calculate Capacity
        </button>

        <ul style={{ marginTop: "15px" }}>
          {production.length > 0 ? (
            production.map((p, i) => (
              <li key={i} style={{ fontSize: "1.1em", padding: "5px 0" }}>
                <strong>{p.productName}</strong> → Máximo:{" "}
                <strong>{p.quantityPossible}</strong> unidades | Valor total:{" "}
                <strong>${p.totalValue}</strong>
              </li>
            ))
          ) : (
            <p style={{ color: "#666" }}>
              Clique no botão para calcular com base no estoque atual.
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}

export default App;
