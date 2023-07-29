import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuditProduct } from '../api/products.api'
import '@styles/ShoppingHistory.scss'


export const AuditHistory = () => {
    const nav = useNavigate()
    const [auditData, setAuditData] = React.useState([])

    React.useEffect(() => {
        // Llamar a la función para obtener los datos de auditoría desde el backend
        getAuditProduct()
            .then(response => {
                setAuditData(response.data)
            })
            .catch(error => {
                console.error('Error al obtener datos de auditoría:', error)
            })
    }, [])

    return (
        <div className="shopping-history">
            <button className="home-button" onClick={() => nav('/view-admin')}>
                🡸 Volver
            </button>
            <div className="containerHistory">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Usuario</th>
                            <th>Nombre del Producto</th>
                            <th>Acción</th>
                            <th>Fecha y Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditData.map(audit => (
                            <tr key={audit.id}>
                                <td>{audit.nam_reg}</td>
                                <td>{audit.nam_prd}</td>
                                <td>{audit.action}</td>
                                <td>{audit.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
