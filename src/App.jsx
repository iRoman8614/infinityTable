import { InfiniteTable } from '@components/Table';
import './App.css';

function App() {
    return (
        <div className="app">
            <h1>Бесконечная таблица с виртуализацией</h1>
            <InfiniteTable />
        </div>
    );
}

export default App;