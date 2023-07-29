import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ProductEditItem from '@components/ProductEditItem';
import { updateProduct, getProductById, createAuditProduct } from '../api/products.api.js';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProducts } from "../api/products.api";
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import '@styles/EditProduct.scss';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';

const cookies = new Cookies()

export const EditProduct = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { id } = useParams();
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
        reset(productData);
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

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      product.nam_prd.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  }, [products, nameFilter]);

  const onSubmit = async (data) => {
    try {
      if (!selectedFile) {
        toast.error('Debes seleccionar una imagen antes de continuar.', { theme: "colored" })
        return;
      }

      await updateProduct(id, data, selectedFile);
      toast.success(`Producto ${product.nam_prd} actualizado satisfactoriamente`, { theme: "colored" });

      const userId = parseInt(cookies.get('id'));

      const auditData = {
        product_id: parseInt(id),
        user_id: userId,
        action: 'U',
      };
      await createAuditProduct(auditData);

      window.location.reload();
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

  const categoryMap = {
    "electrico": 2,
    "mecanico": 3,
    "construcción": 4
  };

  if (errors.name) {
    toast.error(`${errors.name.message}`, { theme: "colored" })
  }

  if (errors.price) {
    toast.error(`${errors.price.message}`, { theme: "colored" })
  }

  if (errors.quantity) {
    toast.error(`${errors.quantity.message}`, { theme: "colored" })
  }

  if (errors.description) {
    toast.error(`${errors.description.message}`, { theme: "colored" })
  }


  return (
    <div>
      <div className="EditProduct">
        <button onClick={goHome} className="home-button">
          🡸 Volver
        </button>
        <div className="product-container">
          <h1 className="titleP">Editar Producto</h1>
          <ToastContainer />
          {product && (
            <form onSubmit={handleSubmit(onSubmit)} className="form" encType='multipart/form-data'>
              <label htmlFor="name" className="label">Nombre del producto</label>
              <input
                type="text"
                id='name'
                className="input input-email"
                defaultValue={product.nam_prd}
                {...register('name', {
                  required: 'El campo de nombre es requerido',
                  minLength: {
                    value: 6,
                    message: 'El nombre debe tener mínimo 6 caracteres',
                  },
                  maxLength: {
                    value: 40,
                    message: 'El nombre debe tener máximo 40 caracteres',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/,
                    message: 'El nombre solo puede contener letras, números y caracteres especiales',
                  },
                })}
              />

              <label htmlFor="price" className="label">Precio del producto</label>
              <input type="number" id='price' className="input input-email" defaultValue={product.prc_prd}
                {...register('price', {
                  required: 'El campo de precio es requerido',
                  pattern: {
                    value: /^(\d+([.]\d{0,2})?)?$/,
                    message: 'Ingresa un valor de precio válido',
                  },
                })}
                onKeyPress={(e) => {
                  const keyCode = e.keyCode || e.which;
                  const keyValue = String.fromCharCode(keyCode);
                  const isValidInput = /^[0-9.]+$/.test(keyValue); // Incluye la coma y el punto como caracteres válidos

                  if (!isValidInput) {
                    e.preventDefault();
                  }
                }}
              />

              <label htmlFor="quantity" className="label">Cantidad de productos</label>
              <input type="number" id='quantity' className="input input-email" defaultValue={product.qty_prd}
                {...register('quantity', {
                  required: 'El campo de cantidad es requerido',
                })} />

              <label htmlFor="category" className="label">Categoria de productos</label>
              <select name="category" id="category" className="form-select" tabIndex="1" defaultValue={categoryMap[product.cat_prd]}
                {...register('category', { required: true })}>
                <option value={2}>Electrico</option>
                <option value={3}>Mecanico</option>
                <option value={4}>Construcción</option>
              </select>

              <label className="label">Descripcion</label>
              <textarea id="description" placeholder="Product Description" className="input" defaultValue={product.desc_prd}
                {...register('description', {
                  required: 'El campo de descripción es requerido',
                  minLength: {
                    value: 10,
                    message: 'La descripción debe tener un mínimo de 10 caracteres',
                  },
                  maxLength: {
                    value: 60,
                    message: 'La descripción debe tener un máximo de 60 caracteres',
                  },
                })}
              />

              <label htmlFor="file" className="label">Imagen del producto</label>
              <input type="file" id='file' name="file" onChange={handleImageChange} className="input input-email" />
              {errors.image && <span className="error">El campo de imagen es requerido</span>}
              <input type="submit" className="primary-button login-button" value="Actualizar" />

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

export default EditProduct;
