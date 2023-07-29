import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createProduct, createAuditProduct } from '../api/products.api.js';
import { useNavigate } from 'react-router-dom';
import '@styles/CreateProduct.scss';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';

const cookies = new Cookies()

const CreateProduct = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const nav = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);

    const onSubmit = async (data) => {
        try {
            if (!selectedFile) {
                // Si no se ha seleccionado ningún archivo, mostramos un mensaje de error
                toast.error('Debes seleccionar una imagen antes de continuar.', {theme: "colored"})
                return;
            }
            const createdProduct = await createProduct(data, selectedFile);

            // Obtener el id del producto creado y el id del usuario desde la cookie
            const productId = parseInt(createdProduct.data.id);
            const userId = parseInt(cookies.get('id'));

            // Crear la auditoría con la acción de creación
            const auditData = {
                product_id: productId,
                user_id: userId,
                action: 'C'
            };
            await createAuditProduct(auditData);
            toast.success(`Producto actualizado satisfactoriamente`, {theme: "colored"})

        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const goHome = () => {
        nav('/view-admin');
    }

    if(errors.name){
        toast.error(`${errors.name.message}`, {theme: "colored"})
    }

    if(errors.price){
        toast.error(`${errors.price.message}`, {theme: "colored"})
    }
    
    if(errors.quantity){
        toast.error(`${errors.quantity.message}`, {theme: "colored"})
    }
    
    if(errors.description){
        toast.error(`${errors.description.message}`, {theme: "colored"})
    }

    return (
        <div className="Login">
            <button onClick={goHome} className="home-button">
                🡸 Volver
            </button>
            <div className="product-container">
                <h1 className="titleP">Crear productos</h1>
                <ToastContainer />
                <form onSubmit={handleSubmit(onSubmit)} className="form" encType="multipart/form-data">
                    <label htmlFor="name" className="label">
                        Nombre del producto
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="input input-email"
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

                    <label htmlFor="price" className="label">
                        Precio del producto
                    </label>
                    <input
                        type="text"
                        id="price"
                        className="input input-email"
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


                    <label htmlFor="quantity" className="label">
                        Cantidad de productos
                    </label>
                    <input
                        type="text"
                        id="quantity"
                        className="input input-email"
                        {...register('quantity', {
                            required: 'El campo de cantidad es requerido',
                        })}
                        onKeyPress={(e) => {
                            const keyCode = e.keyCode || e.which;
                            const keyValue = String.fromCharCode(keyCode);
                            const isValidInput = /^[0-9]+$/.test(keyValue);

                            if (!isValidInput) {
                                e.preventDefault();
                            }
                        }}
                    />

                    <label htmlFor="category" className="label">
                        Categoria del producto
                    </label>
                    <select
                        name="niv_acc"
                        id="category"
                        className="form-select"
                        tabIndex="1"
                        {...register('category', { required: true })}
                    >
                        <option value="2">Electricidad</option>
                        <option value="3">Mecanica</option>
                        <option value="4">Construcccion</option>
                    </select>

                    <label className="label">Descripcion</label>
                    <textarea
                        id="description"
                        placeholder="Product Description"
                        className="input textarea"
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

                    <label htmlFor="file" className="label">
                        Imagen del producto
                    </label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleImageChange}
                        className="input input-email"
                    />

                    <input type="submit" className="primary-button login-button" value="Crear" />
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;