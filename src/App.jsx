import 'swiper/css';
import 'swiper/css/autoplay'; // optional, for autoplay feature
import Routing from './Routing'; // Adjust the path if needed
import { LanguageProvider } from './context/LanguageContext';
import { debugLanguageDetection } from './utils/languageUtils';

const App = () => {
  // Debug language detection on app start
  debugLanguageDetection();
  
  return (
    <LanguageProvider>
      <div>
        <Routing />
      </div>
    </LanguageProvider>
  );
};

export default App;
