import React, { useEffect, useState } from 'react';
import { getTopProducts, getTopCategoryProducts, getTopSellingMonths, getTotalSalesByMonth } from '../api/products.api';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ApexCharts from 'react-apexcharts';
import '@styles/ViewAdmin.scss';

const cookies = new Cookies();

export const ViewAdmin = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topSellingMonths, setTopSellingMonths] = useState([]);
  const [totalSalesByMonth, setTotalSalesByMonth] = useState([]);

  useEffect(() => {
    fetchTopProducts();
    fetchTopCategories();
    fetchTopSellingMonths();
    fetchTotalSalesByMonth();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const response = await getTopProducts();
      setTopProducts(response.data);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  const fetchTopCategories = async () => {
    try {
      const response = await getTopCategoryProducts();
      setTopCategories(response.data);
    } catch (error) {
      console.error('Error fetching top categories:', error);
    }
  };

  const fetchTopSellingMonths = async () => {
    try {
      const response = await getTopSellingMonths();
      setTopSellingMonths(response.data);
    } catch (error) {
      console.error('Error fetching top selling months:', error);
    }
  };

  const fetchTotalSalesByMonth = async () => {
    try {
      const response = await getTotalSalesByMonth();
      setTotalSalesByMonth(response.data);
    } catch (error) {
      console.error('Error fetching total sales by month:', error);
    }
  };

  // Datos para el gráfico de barras de Top 5 Productos Más Vendidos
  const topProductsChartData = {
    options: {
      chart: {
        id: 'top-products-chart',
      },
      xaxis: {
        categories: topProducts.map((product) => product.product_name),
      },
      colors: ['#e88821'],
    },
    series: [
      {
        name: 'Cantidad Vendida',
        data: topProducts.map((product) => product.total_qty_sold),
      },
    ],
  };

  // Datos para el gráfico de barras de Top 5 Categorías de Productos
  const topCategoriesChartData = {
    options: {
      chart: {
        id: 'top-categories-chart',
      },
      xaxis: {
        categories: topCategories.map((category) => category.category_name),
      },
      colors: ['#3538f3'],
    },
    series: [
      {
        name: 'Cantidad Vendida',
        data: topCategories.map((category) => category.total_qty_sold),
      },
    ],
  };

  // Datos para el gráfico de barras de Top 5 Meses de Mayor Venta
  const topSellingMonthsChartData = {
    options: {
      chart: {
        id: 'top-selling-months-chart',
      },
      xaxis: {
        categories: topSellingMonths.map((item) => item.month),
      },
      colors: ['#34c756'],
    },
    series: [
      {
        name: 'Cantidad Vendida',
        data: topSellingMonths.map((item) => parseFloat(item.total_sales.toFixed(2))),
      },
    ],
  };

  // Datos para el gráfico de barras de Ventas Totales por Mes
  const totalSalesByMonthChartData = {
    options: {
      chart: {
        id: 'total-sales-by-month-chart',
      },
      xaxis: {
        categories: totalSalesByMonth.map((item) => item.month),
      },
      colors: ['#ff6c5f'],
      tooltip: {
        y: {
          formatter: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
    series: [
      {
        name: 'Ventas Totales',
        data: totalSalesByMonth.map((item) => parseFloat(item.total_sales.replace('$', ''))),
      },
    ],
  };


  let createProduct;
  let EditProduct;
  let Sales;
  if (cookies.get('module').insert_prd) {
    createProduct = (
      <div className="sidebar-item">
        <Link to="/create-product" className="buttonadmin1">
          Crear Producto
        </Link>
      </div>
    );
  }

  if (cookies.get('module').edit_prd) {
    EditProduct = (
      <div className="sidebar-item">
        <Link to="/edit-product" className="buttonadmin2">
          Editar Producto
        </Link>
      </div>
    );
  }

  if (cookies.get('module').sales_history) {
    Sales = (
      <div className="sidebar-item">
        <Link to="/sales-history" className="buttonadmin5">
          Historial de Ventas
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <div className="headerAdmin">
          <div className="sidebar-item">
            <Link to="/home" className="buttonadmin3">
              🡸 Volver
            </Link>
          </div>
          <h1 className="AdminTitle">Panel de Administración</h1>
        </div>
        <div className="linksAdmin">
          {createProduct}
          {EditProduct}
          {Sales}
          <div className="sidebar-item">
            <Link to="/generate-report" className="buttonadmin4">
              Generar Reporte
            </Link>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="main-panel">
          <div className="content-section1">
            <h2>5 Productos Más Vendidos</h2>
            {topProducts.length > 0 ? (
              <ApexCharts
                options={topProductsChartData.options}
                series={topProductsChartData.series}
                type="bar"
                height={350}
              />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
          <div className="content-section2">
            <h2>Categorías de Productos Más Vendidas</h2>
            {topCategories.length > 0 ? (
              <ApexCharts
                options={topCategoriesChartData.options}
                series={topCategoriesChartData.series}
                type="bar"
                height={350}
              />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        </div>
        <div className="main-panel">
          <div className="content-section3">
            <h2>Meses de Mayor Venta</h2>
            {topSellingMonths.length > 0 ? (
              <ApexCharts
                options={topSellingMonthsChartData.options}
                series={topSellingMonthsChartData.series}
                height={350}
                width={1589}
              />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
          <div className="content-section4">
            <h2>Ventas Totales por Mes</h2>
            {totalSalesByMonth.length > 0 ? (
              <ApexCharts
                options={totalSalesByMonthChartData.options}
                series={totalSalesByMonthChartData.series}
                type="line"
                height={350}
                width={1589}
              />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
