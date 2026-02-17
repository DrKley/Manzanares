import { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonChip,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './NewsFeed.css';

interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

const API_URL = 'https://manzanaresstereo.com.co/wp-json/wp/v2/posts';
const PER_PAGE = 10;

const NewsFeed: React.FC = () => {
  const history = useHistory();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number, append = false) => {
    try {
      const response = await fetch(
        `${API_URL}?page=${pageNum}&per_page=${PER_PAGE}&_embed`
      );

      if (!response.ok) {
        if (response.status === 400) {
          setHasMore(false);
          return;
        }
        throw new Error('Failed to fetch posts');
      }

      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const data: Post[] = await response.json();

      setPosts(prev => append ? [...prev, ...data] : data);
      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMore = async (event: CustomEvent<void>) => {
    const nextPage = page + 1;
    await fetchPosts(nextPage, true);
    setPage(nextPage);
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

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

  const getFeaturedImage = (post: Post): string | null => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
  };

  const openPost = (postId: number) => {
    history.push(`/article/${postId}`);
  };

  if (loading) {
    return (
      <div className="news-feed">
        <h2 className="news-title">Noticias</h2>
        {[1, 2, 3].map(i => (
          <IonCard key={i} className="news-card skeleton-card">
            <IonSkeletonText animated style={{ height: '180px', margin: 0 }} />
            <IonCardHeader>
              <IonSkeletonText animated style={{ width: '80%', height: '24px' }} />
            </IonCardHeader>
            <IonCardContent>
              <IonSkeletonText animated style={{ width: '100%' }} />
              <IonSkeletonText animated style={{ width: '90%' }} />
              <IonSkeletonText animated style={{ width: '70%' }} />
            </IonCardContent>
          </IonCard>
        ))}
      </div>
    );
  }

  return (
    <div className="news-feed">
      <h2 className="news-title">Noticias</h2>

      {posts.map(post => {
        const featuredImage = getFeaturedImage(post);
        return (
          <IonCard
            key={post.id}
            className="news-card"
            button
            onClick={() => openPost(post.id)}
          >
            {featuredImage && (
              <div className="news-image-container">
                <img
                  src={featuredImage}
                  alt=""
                  className="news-image"
                  loading="lazy"
                />
              </div>
            )}
            <IonCardHeader>
              <IonChip className="date-chip">{formatDate(post.date)}</IonChip>
              <IonCardTitle className="news-card-title">
                {stripHtml(post.title.rendered)}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="news-excerpt">
                {stripHtml(post.excerpt.rendered).slice(0, 150)}...
              </p>
            </IonCardContent>
          </IonCard>
        );
      })}

      <IonInfiniteScroll
        onIonInfinite={loadMore}
        threshold="100px"
        disabled={!hasMore}
      >
        <IonInfiniteScrollContent
          loadingSpinner="crescent"
          loadingText="Cargando más noticias..."
        />
      </IonInfiniteScroll>
    </div>
  );
};

export default NewsFeed;
