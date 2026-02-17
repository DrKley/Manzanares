import { useRef, useState } from 'react';
import { IonRange } from '@ionic/react';
import './RadioPlayer.css';

const STREAM_URL = 'https://radiolatina.info/7408/stream';

const RadioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<'stopped' | 'connecting' | 'live' | 'error'>('stopped');
  const [volume, setVolume] = useState(80);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.src = '';
      setIsPlaying(false);
      setStatus('stopped');
    } else {
      audio.src = STREAM_URL;
      audio.load();
      setStatus('connecting');
      audio.play().catch(() => {
        setStatus('error');
      });
    }
  };

  const handlePlaying = () => {
    setIsPlaying(true);
    setStatus('live');
  };

  const handleError = () => {
    setIsPlaying(false);
    setStatus('error');
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'live': return 'En Vivo';
      case 'connecting': return 'Conectando...';
      case 'error': return 'Error de conexión';
      default: return 'Detenido';
    }
  };

  return (
    <div className="radio-player">
      <div className={`logo-container ${isPlaying ? 'playing' : ''}`}>
        <img src="/logo.png" alt="Manzanares Stereo" className="logo-img" />
      </div>

      <div className="station-info">
        <h1 className="station-name">Manzanares Stereo</h1>
        <p className={`station-status ${status === 'live' ? 'live' : ''}`}>
          {getStatusText()}
        </p>
      </div>

      <div className={`visualizer ${isPlaying ? 'active' : ''}`}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className="controls">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          disabled={status === 'connecting'}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          <svg className="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg className="pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
      </div>

      <div className="volume-container">
        <span className="volume-icon">🔈</span>
        <IonRange
          min={0}
          max={100}
          value={volume}
          onIonChange={(e) => handleVolumeChange(e.detail.value as number)}
          className="volume-slider"
        />
        <span className="volume-icon">🔊</span>
      </div>

      <audio
        ref={audioRef}
        preload="none"
        onPlaying={handlePlaying}
        onPause={() => { setIsPlaying(false); setStatus('stopped'); }}
        onError={handleError}
      />
    </div>
  );
};

export default RadioPlayer;
