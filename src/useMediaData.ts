import { useState, useEffect } from 'react';
import { supabase, MediaItem } from '../lib/supabase';

export function useMediaData(type: string, userId: string | null) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaItems();

    const channel = supabase
      .channel('media-likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes'
        },
        () => {
          fetchMediaItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [type, userId]);

  async function fetchMediaItems() {
    try {
      setLoading(true);

      const { data: items, error: itemsError } = await supabase
        .from('media_items')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      if (!items) {
        setMediaItems([]);
        setLoading(false);
        return;
      }

      const { data: likesData } = await supabase
        .from('likes')
        .select('media_id, user_id');

      const { data: followsData } = await supabase
        .from('follows')
        .select('creator_name, follower_id');

      const likeCounts: Record<string, number> = {};
      const userLikes = new Set<string>();

      if (likesData) {
        likesData.forEach(like => {
          likeCounts[like.media_id] = (likeCounts[like.media_id] || 0) + 1;
          if (userId && like.user_id === userId) {
            userLikes.add(like.media_id);
          }
        });
      }

      const userFollows = new Set<string>();
      if (followsData && userId) {
        followsData.forEach(follow => {
          if (follow.follower_id === userId) {
            userFollows.add(follow.creator_name);
          }
        });
      }

      const enrichedItems: MediaItem[] = items.map(item => ({
        ...item,
        like_count: likeCounts[item.id] || 0,
        is_liked: userLikes.has(item.id),
        is_followed: userFollows.has(item.creator)
      }));

      setMediaItems(enrichedItems);
    } catch (error) {
      console.error('Error fetching media items:', error);
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  }

  return { mediaItems, loading, refetch: fetchMediaItems };
}
