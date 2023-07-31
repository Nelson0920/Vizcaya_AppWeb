import React, { useState, useEffect } from 'react'
import ProductItem from '@components/ProductItem'
import Box from '@mui/material/Box'
import { ToastContainer } from 'react-toastify';
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { getAllProducts } from "../api/products.api"
import publi1 from '@logos/publiImg.jpg';
import publi2 from '@logos/publiImg2.jpg';
import publi3 from '@logos/publiImg3.jpg';
import noEncotrado from '@logos/producto-no-encontrado.jpg';
import '@styles/ProductList.scss'

const options = ['todo', 'electrico', 'mecanico', 'construccion']

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('')
  const [filterMinPrice, setFilterMinPrice] = useState('')
  const [filterMaxPrice, setFilterMaxPrice] = useState('')
  const [filterCategory, setFilterCategory] = useState(options[0])
  const [filteredProducts, setFilteredProducts] = useState([])

  const handleNameChange = (event) => {
    setFilter(event.target.value.replace(/\s+/g, '').toLowerCase())
  }


  const handleCategoryChange = (event, value) => {
    setFilterCategory(value)
  }

  useEffect(() => {
    async function loadProducts() {
      const res = await getAllProducts()
      setProducts(res.data)
    }
    loadProducts()
  }, [])

  useEffect(() => {
    let updatedProducts = products

    if (filter) {
      updatedProducts = updatedProducts.filter((product) =>
        product.nam_prd.toLowerCase().includes(filter)
      )
    }

    if (filterMinPrice && filterMaxPrice) {
      const minPrice = parseFloat(filterMinPrice)
      const maxPrice = parseFloat(filterMaxPrice)
      updatedProducts = updatedProducts.filter((product) => {
        const price = parseFloat(product.prc_prd)
        return price >= minPrice && price <= maxPrice
      })
    }

    if (filterCategory !== 'todo') {
      updatedProducts = updatedProducts.filter(
        (product) => product.cat_prd === filterCategory
      )
    }

    setFilteredProducts(updatedProducts)
  }, [filter, filterMinPrice, filterMaxPrice, filterCategory, products])

  
  const handleMinPriceChange = (e) => {
    const inputNumber = parseInt(e.target.value);
    if (!isNaN(inputNumber) && inputNumber >= 0) {
      setFilterMinPrice(inputNumber);
    }
  };

  const handleMaxPriceChange = (e) => {
    const inputNumber = parseInt(e.target.value);
    if (!isNaN(inputNumber) && inputNumber >= 0) {
      setFilterMaxPrice(inputNumber);
    }
  };

  return (
    <section className="home">
      <div className="publiImg">
        <img src={publi1} alt="" />
      </div>

      <div className="boxHomeProducts">

        <div className="publicidad">
          <img src={publi2} alt="" />
          <img src={publi3} alt="" />
        </div>

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
                label="Nombre"
                variant="outlined"
                onChange={handleNameChange}
                sx={{ minWidth: 500 }} // Cambia el tamaño ajustando el ancho mínimo
              />
              <TextField
                label="Precio Min"
                value={filterMinPrice}
                onChange={handleMinPriceChange}
                name="minPrice"
                type="number"
                variant="outlined"
                sx={{ minWidth: 350 }}
              />
              <TextField
                label="Precio Max"
                value={filterMaxPrice}
                onChange={handleMaxPriceChange}
                name="maxPrice"
                type="number"
                variant="outlined"
                sx={{ minWidth: 350 }}
              />
            </div>
            <div className="ProductList__filter">
              <Autocomplete
                id="category"
                options={options}
                value={filterCategory}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField {...params} label="Categoria" variant="outlined" />
                )}
              />
            </div>
          </Box>
        </form>

        <div className="ProductList">
          <ToastContainer />
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            <>
              <img src={noEncotrado} className='imgPNF' alt="" />
              <p className="no-products">No se pudieron encontrar productos con tu descripción 😔.</p>
            </>
          )}
        </div>

      </div>

      <footer className="footer">
        <div className="footer-content">
          <h3>¡Descubre nuestra gran selección de productos!</h3>
          <p>Contamos con una amplia variedad de artículos para tus necesidades. ¡Explora nuestro catálogo ahora!</p>
          <button className="footer-button">Explorar</button>
        </div>
      </footer>
    </section>
  )
}

export default ProductList
