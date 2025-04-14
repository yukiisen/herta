import { Chat } from './components/Chat';

function App() {
    return (
        <div className="flex text-text place-content-center h-full">
            <div className='w-full h-full z-1 absolute wallpaper-cover blur-lg'></div>
            <Chat />
        </div>
    )
}

export default App
