import { Routes, Route } from 'react-router'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import { JsxElement } from 'typescript'
import Songs from './pages/Songs'

const RoutePages = () => {
    return (
        <Routes>
            <Route element={<Artists />} path='/' index/>
            <Route element={<Albums />} path="/album" />
            <Route element={<Songs />} path="/song" />
        </Routes>
    )
}

export default RoutePages