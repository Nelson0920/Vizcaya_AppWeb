import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ProductEditItem from '@components/ProductEditItem';
import { deleteProductAdmin, deleteProduct, updateProduct, getProductById, restoreProduct, createAuditProduct} from '../api/products.api.js';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProducts } from "../api/products.api";
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import '@styles/EditProduct.scss';
import Cookies from 'universal-cookie';


const cookies = new Cookies()

export const EditProduct = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { id } = useParams();
  const { idlt } = useParams();
  const { idlta } = useParams();
  const { idrt } = useParams();

  const nav = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        reset(productData); // Actualizar los valores del formulario con los nuevos datos del producto
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id, reset]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    loadProducts();
  }, []);
  //Eliminacion logica
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const dato = await deleteProduct(idlt);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [idlt]);

  //eliminacion definitiva del admin
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const dato = await deleteProductAdmin(idlta);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [idlt]);

  //restauracion de la eliminacion logica
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const dato = await restoreProduct(idrt);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [idrt]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      product.nam_prd.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  }, [products, nameFilter]);

  const onSubmit = async (data) => {
    try {
      await updateProduct(id, data, selectedFile);
      alert("Producto actualizado satisfactoriamente");

      // Obtener el id del usuario desde la cookie
      const userId = parseInt(cookies.get('id'));

      // Crear la auditoría con la acción de actualización (U)
      const auditData = {
        product_id: parseInt(id), // Convertir id a número si no lo está ya
        user_id: userId,
        action: 'U',
      };
      await createAuditProduct(auditData);

      window.location.reload(); // Refrescar la página
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const goHome = () => {
    nav('/view-admin');
  };

  const handleNameChange = (event) => {
    setNameFilter(event.target.value);
  };

  return (
    <div>
      <div className="EditProduct">
        <button onClick={goHome} className="home-button">
          🡸 Volver
        </button>
        <div className="product-container">
          <h1 className="titleP">Edit Product</h1>
          {product && (
            <form onSubmit={handleSubmit(onSubmit)} className="form" encType='multipart/form-data'>
              <label htmlFor="name" className="label">Name of Product</label>
              <input type="text" id='name' className="input input-email" defaultValue={product.nam_prd} {...register('name', { required: true })} />
              {errors.name && <span className="error">The name field is required</span>}

              <label htmlFor="price" className="label">Price of Product</label>
              <input type="number" id='price' className="input input-email" defaultValue={product.prc_prd} {...register('price', { required: true })} />
              {errors.price && <span className="error">The price field is required</span>}

              <label htmlFor="quantity" className="label">Quantity of Products</label>
              <input type="number" id='quantity' className="input input-email" defaultValue={product.qty_prd} {...register('quantity')} />

              <label htmlFor="category" className="label">Category of Product</label>
              <select name="niv_acc" id="category" className="form-select" tabIndex="1" defaultValue={product.cat_prd} {...register('category', { required: true })}>
                <option value="2">Electrico</option>
                <option value="3">Mecanico</option>
                <option value="4">Construcción</option>
              </select>

              <label className="label">Description</label>
              <textarea id="description" placeholder="Product Description" className="input" defaultValue={product.desc_prd} {...register('description')} />

              <label htmlFor="file" className="label">Image of Product</label>
              <input type="file" id='file' name="file" onChange={handleImageChange} className="input input-email" />
              {errors.image && <span className="error">The image field is required</span>}

              <input type="submit" className="primary-button login-button" value="Update" />
            </form>
          )}
        </div>
      </div>

      <div className="boxProduct">
        <form className="filter">
          <Box
            sx={{
              '& > :not(style)': {
                m: 1,
              },
            }}
          >
            <div className="price-filter">
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                onChange={handleNameChange}
              />
            </div>
          </Box>
        </form>
        <div className="ProductList">
          {filteredProducts.map((product) => (
            <ProductEditItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
