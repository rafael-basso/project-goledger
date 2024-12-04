import { Routes, Route } from 'react-router'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import { JsxElement } from 'typescript'

const RoutePages = () => {
    return (
        <Routes>
            <Route element={<Artists />} path='/' index/>
            <Route element={<Albums />} path="/album" />
        </Routes>
    )
}

export default RoutePages