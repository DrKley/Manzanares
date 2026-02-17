import { IonContent, IonPage } from '@ionic/react';
import RadioPlayer from '../components/RadioPlayer';
import NewsFeed from '../components/NewsFeed';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen scrollY={true}>
        <div className="home-container">
          <RadioPlayer />
          <div className="scroll-indicator">
            <span>Desliza para ver noticias</span>
            <svg viewBox="0 0 24 24" className="chevron-down">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
          <NewsFeed />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
