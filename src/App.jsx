import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TripsList from './pages/TripsList';
import TripDetail from './pages/TripDetail';
import NewTrip from './pages/NewTrip';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripsList />} />
          <Route path="/trips/new" element={<NewTrip />} />
          <Route path="/trips/:id" element={<TripDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
