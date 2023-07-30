import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import '@styles/MainRoute.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import carousel1 from '@logos/articulosFerreteria.jpg';
import carousel2 from '@logos/herramientas.jpg';
import carousel3 from '@logos/renderFinal_Ferreteria.jpg';

import publi1 from '@logos/herramientas-electricas.jpg';
import publi2 from '@logos/llaves-tuercas.jpg';
import publi3 from '@logos/Herramientas-comunes.jpg';
import publi4 from '@logos/Talador.jpg';
import publi5 from '@logos/martillo-carpintero.jpg';
import publi6 from '@logos/Cinta-metrica.jpg';

export const MainRoute = () => {
    const nav = useNavigate();

    const goToRegister = () => {
        nav('/register');
    };

    const goToLogin = () => {
        nav('/login');
    };

    return (
        <div>
            <div className="market">
                <header className="header">
                    <h1 className="logo">Ferretería Mercado</h1>
                    <nav className="navbar">
                        <div className="navbar-left">
                            <h1>Vizcaya App</h1>
                        </div>
                        <ul className="nav-list">
                            <li className="nav-item">
                                <button className="nav-button" onClick={goToRegister}>
                                    Regístrate
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-button" onClick={goToLogin}>
                                    Inicia Sesión
                                </button>
                            </li>
                        </ul>
                    </nav>
                </header>

                <Carousel showThumbs={false} autoPlay infiniteLoop interval={5000}>
                    <div>
                        <img
                            src={carousel1}
                            alt="Image 1"
                            className="carousel-image"
                        />
                    </div>
                    <div>
                        <img
                            src={carousel2}
                            alt="Image 2"
                            className="carousel-image"
                        />
                    </div>
                    <div>
                        <img
                            src={carousel3}
                            alt="Image 3"
                            className="carousel-image"
                        />
                    </div>
                </Carousel>

                <section className="banner">
                    <h2 className="banner-title">¡Bienvenido a FerroElectricos Vizcaya Market!</h2>
                    <p className="banner-subtitle">
                        Encuentra todo lo que necesitas para tus proyectos
                    </p>
                    <a href="#" className="banner-btn">
                        Explorar
                    </a>
                </section>

                <div className="section-container">
                    <section className="categories">
                        <h2 className="categories-title">Categorías Destacadas</h2>
                        <div className="category-list">
                            <div className="category-item">
                                <img
                                    src={publi1}
                                    alt="Categoría 1"
                                    className="category-image"
                                />
                                <h3 className="category-name">Herramientas eléctricas</h3>
                            </div>
                            <div className="category-item">
                                <img
                                    src={publi2}
                                    alt="Categoría 2"
                                    className="category-image"
                                />
                                <h3 className="category-name">Herramientas Mecanicas</h3>
                            </div>
                            <div className="category-item">
                                <img
                                    src={publi3}
                                    alt="Categoría 3"
                                    className="category-image"
                                />
                                <h3 className="category-name">Materiales de construcción</h3>
                            </div>
                        </div>
                    </section>

                    <section className="featured-products">
                        <h2 className="featured-products-title">Productos Destacados</h2>
                        <div className="product-lista">
                            <div className="product-item">
                                <img
                                    src={publi4}
                                    alt="Producto 1"
                                    className="producto-image"
                                />
                                <h3 className="product-name">Taladro inalámbrico</h3>
                                <p className="product-price">$99.99</p>
                            </div>
                            <div className="product-item">
                                <img
                                    src={publi5}
                                    alt="Producto 2"
                                    className="producto-image"
                                />
                                <h3 className="product-name">Martillo de carpintero</h3>
                                <p className="product-price">$19.99</p>
                            </div>
                            <div className="product-item">
                                <img
                                    src={publi6}
                                    alt="Producto 3"
                                    className="producto-image"
                                />
                                <h3 className="product-name">Cinta métrica</h3>
                                <p className="product-price">$9.99</p>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="footer">
                    <p className="footer-text">
                        &copy; 2023 FerroElectricos Vizcaya. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </div>
    );
};

