import { Routes, Route } from 'react-router'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import Songs from './pages/Songs'
import Playlists from './pages/Playlists'

const RoutePages = () => {
    return (
        <Routes>
            <Route element={<Artists />} path='/' index/>
            <Route element={<Albums />} path="/album" />
            <Route element={<Songs />} path="/song" />
            <Route element={<Playlists />} path="/playlist" />
        </Routes>
    )
}

export default RoutePages