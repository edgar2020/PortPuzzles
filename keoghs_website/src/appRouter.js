import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './homePage'
import Weight from './weightBalancing'
import LoadUnload from './loadingUnloading'
import LogPage from './logFile'
import SignedOut from './signedOut'
import PageNotFound from './pageNotFound'

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/LoadUnload" element={<LoadUnload/>} />
                <Route path="/Weight" element={<Weight/>} />
                <Route path="/LogFiles" element={<LogPage/>} />
                <Route path="/Signed-out" element={<SignedOut/>} />
                <Route
                    path="*"
                    element={<PageNotFound />}
                />
            </Routes>
        </BrowserRouter>
    )
}
export default AppRouter
