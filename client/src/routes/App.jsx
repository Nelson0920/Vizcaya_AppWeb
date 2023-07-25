import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@containers/Layout';
import Home from '@pages/Home';
import Login from '@pages/Login';
import { MainRoute } from '@pages/MainRoute';
import { Checkout } from '@pages/Checkout';
import { ProtectedRoute } from '../components/ProtectecRoute';
import { ProtectedRouteTwo } from '../components/ProtectecRouteTwo';
import { CreateAccount } from '@pages/CreateAccount';
import { EditProduct } from '@pages/EditProduct';
import { ViewAdmin } from '@pages/ViewAdmin';
import { ShoppingHistory } from '@pages/ShoppingHistory';
import { SalesHistory } from '@pages/SalesHistory';
import { EditUserProfile } from '@pages/EditUserProfile';
import { AuditHistory } from '@pages/AuditHistory';
import NotFound from '@pages/NotFound';
import CreateProduct from '@pages/CreateProduct';
import AppContext from '@context/AppContext';
import useInitialState from '@hooks/useInitialState';
import '@styles/global.css';
import Cookies from 'universal-cookie';


const cookies = new Cookies()

export const App = () => {

    var user = {
        id_usr: cookies.get('id'),
        name: cookies.get('nam_reg'),
        ema_usr: cookies.get('eml_reg'),
        niv_acc: cookies.get('rol_reg'),
        cell_usr: cookies.get('cell_reg'),
        module: cookies.get('module')
    }

    const initialState = useInitialState()
    return (
        <AppContext.Provider value={initialState}>

            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route element={<ProtectedRouteTwo isAllowed={user.id_usr} />}>
                            <Route exact path="/" element={<MainRoute />} />
                            <Route exact path="/register" element={<CreateAccount />} />
                            <Route exact path="/login" element={<Login />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.log_usr} />}>
                            <Route exact path="/home" element={<Home />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.checkout_prd} />}>
                            <Route exact path="/checkout" element={<Checkout />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.dashboard} />}>
                            <Route exact path="/view-admin" element={<ViewAdmin />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.shopping_history} />}>
                            <Route exact path="/history" element={<ShoppingHistory />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.settings} />}>
                            <Route exact path="/user-settings" element={<EditUserProfile />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.sales_history} />}>
                            <Route exact path="/sales-history" element={<SalesHistory />} />
                        </Route>

                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.audit} />}>
                            <Route exact path="/audit-history" element={<AuditHistory />} />
                        </Route>

                        <Route exact path="/create-product" element={
                            <ProtectedRoute isAllowed={!!user.module && user.module.insert_prd} redirectTo="/home">
                                <CreateProduct />
                            </ProtectedRoute>
                        } />
                        
                        <Route element={<ProtectedRoute isAllowed={!!user.module && user.module.edit_prd} redirectTo="/home" />}>
                            <Route exact path="/edit-product/" element={<EditProduct />} />
                            <Route exact path="/edit-product/:id" element={<EditProduct />} />
                            <Route exact path="/delete-product/:idlt" element={<EditProduct />} />
                            <Route exact path="/restore-product/:idrt" element={<EditProduct />} />
                            <Route exact path="/delete-product-admin/:idlta" element={<EditProduct />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AppContext.Provider>
    )
}

