import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSkeletonText,
  IonChip,
} from '@ionic/react';
import './ArticleDetail.css';

interface PostDetail {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

const API_URL = 'https://manzanaresstereo.com.co/wp-json/wp/v2/posts';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}?_embed`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data: PostDetail = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const featuredImage = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <IonPage>
      <IonHeader className="article-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Volver" />
          </IonButtons>
          <IonTitle>{post ? stripHtml(post.title.rendered) : 'Cargando...'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={true}>
        {loading ? (
          <div className="article-skeleton">
            <IonSkeletonText animated style={{ width: '100%', height: '250px' }} />
            <div className="article-skeleton-body">
              <IonSkeletonText animated style={{ width: '40%', height: '24px' }} />
              <IonSkeletonText animated style={{ width: '90%', height: '32px', marginTop: '12px' }} />
              <IonSkeletonText animated style={{ width: '100%', height: '16px', marginTop: '24px' }} />
              <IonSkeletonText animated style={{ width: '95%', height: '16px', marginTop: '8px' }} />
              <IonSkeletonText animated style={{ width: '80%', height: '16px', marginTop: '8px' }} />
            </div>
          </div>
        ) : post ? (
          <div className="article-detail">
            {featuredImage && (
              <div className="article-hero">
                <img src={featuredImage} alt="" className="article-hero-image" />
              </div>
            )}
            <div className="article-body">
              <IonChip className="article-date-chip">{formatDate(post.date)}</IonChip>
              <h1 className="article-title">{stripHtml(post.title.rendered)}</h1>
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </div>
        ) : (
          <div className="article-error">
            <p>No se pudo cargar el artículo.</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ArticleDetail;
