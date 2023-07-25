import axios from 'axios'

const connectionApiProducts = axios.create({
  baseURL: 'http://127.0.0.1:3000/products/api/v2/products/',
})

const connectionApiProducts2 = axios.create({
  baseURL: 'http://127.0.0.1:3000/products/api/v3/products/',
})

const connectionApiProductsAudit = axios.create({
  baseURL: 'http://127.0.0.1:3000/products/api/',
})

export const getAllProducts = () => connectionApiProducts.get('/')

export const createProduct = (data, file) => {

  const formData = new FormData()
  formData.append('nam_prd', data.name)
  formData.append('prc_prd', data.price)
  formData.append('img_prd', file)
  formData.append('qty_prd', data.quantity)
  formData.append('desc_prd', data.description)
  formData.append('cat_prd', data.category)

  return connectionApiProducts.post('/', formData)
    .catch(error => {
      console.log('Error:', error)
      throw error // Puedes rechazar la promesa o manejar el error de otra manera
    })
}

export const getProductById = (id) => {
  return connectionApiProducts.get(`/${id}/`)
    .then(response => response.data)
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}

export const updateProduct = (id, data, file) => {
  const formData = new FormData()
  formData.append('nam_prd', data.name)
  formData.append('prc_prd', data.price)
  formData.append('img_prd', file)
  formData.append('qty_prd', data.quantity)
  formData.append('desc_prd', data.description)
  formData.append('cat_prd', data.category)

  return connectionApiProducts.put(`/${id}/`, formData)
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}

export const deleteProduct = (id) => {
  const formData = new FormData()
  formData.append('del_prd', 0)
  return connectionApiProducts.patch(`/${id}/`, formData)
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}

export const restoreProduct = (id) => {
  const formData = new FormData()
  formData.append('del_prd', 1)
  return connectionApiProducts.patch(`/${id}/`, formData)
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}

export const deleteProductAdmin = (id) => {
  return connectionApiProducts.delete(`/${id}/`)
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}


export const updateProductQty = (id, difference) => {
  const formData = new FormData()
  formData.append('qty_prd', difference)
  return connectionApiProducts.patch(`/${id}/update_qty/`, formData)
    .then(response => {
      console.log('Respuesta:', response.data)
      // Aquí puedes realizar acciones adicionales con la respuesta si es necesario
    })
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}


export const createOrder = (data) => {
  return connectionApiProducts2.post('/orders/', data)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}


export const createOrderDetail = (data) => {
  return connectionApiProducts2.post('/order-details/', data)
    .then(response => {
      console.log('Detalle de orden creado:', response.data)
      // Aquí puedes realizar acciones adicionales con la respuesta si es necesario
    })
    .catch(error => {
      console.log('Error:', error)
      throw error
    })
}


export const getOrdersByClientId = (clientId) => connectionApiProducts2.get(`/${clientId}/orders/`)


export const getUsersOrders = () => {return connectionApiProducts2.get('/user/orders/')}


export const getTopProducts = () => {return connectionApiProducts2.get('/top/')}


export const getTopCategoryProducts = () => {return connectionApiProducts2.get('/top-categories/')}


export const getTopSellingMonths = () => {return connectionApiProducts2.get('/top-selling-months/')}


export const getTotalSalesByMonth = () => {return connectionApiProducts2.get('/total-sales-by-month/')}


export const getProductsStarsSummary = (productId) => {
  return connectionApiProducts2.get(`/product-stars-summary/${productId}/`)
}


export const getProductStars = (id) => {
  return connectionApiProducts2.get(`/product-stars/${id}/`)
}


export const productStars = (id, data) => {
  return connectionApiProducts2.post(`/product-stars/${id}/`, data)
}



//-----------Auditoria--------------------



export const createAuditProduct = (auditData) => {

  return connectionApiProductsAudit.post('/product_audits/', auditData)
    .then(response => {
      console.log('Registro de auditoría creado exitosamente:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error al crear el registro de auditoría:', error);
      throw error;
    });
};


export const getAuditProduct = () => {return connectionApiProductsAudit.get('/get-product-audit/')}