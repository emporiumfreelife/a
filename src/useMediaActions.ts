import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useMediaActions(userId: string | null, onUnauthenticated: () => void) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const toggleLike = async (mediaId: string, isLiked: boolean) => {
    if (!userId) {
      onUnauthenticated();
      return;
    }

    try {
      setActionLoading(`like-${mediaId}`);

      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('media_id', mediaId);

        if (error) throw error;
      } else {
        const { data: existingLike } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', userId)
          .eq('media_id', mediaId)
          .maybeSingle();

        if (!existingLike) {
          const { error } = await supabase
            .from('likes')
            .insert({ user_id: userId, media_id: mediaId });

          if (error) throw error;
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleFollow = async (creatorName: string, isFollowed: boolean) => {
    if (!userId) {
      onUnauthenticated();
      return;
    }

    try {
      setActionLoading(`follow-${creatorName}`);

      if (isFollowed) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', userId)
          .eq('creator_name', creatorName);

        if (error) throw error;
      } else {
        const { data: existingFollow } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', userId)
          .eq('creator_name', creatorName)
          .maybeSingle();

        if (!existingFollow) {
          const { error } = await supabase
            .from('follows')
            .insert({ follower_id: userId, creator_name: creatorName });

          if (error) throw error;
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const sendTip = async (creatorName: string, amount: number) => {
    if (!userId) {
      onUnauthenticated();
      return;
    }

    try {
      setActionLoading(`tip-${creatorName}`);

      const { error } = await supabase
        .from('tips')
        .insert({ from_user_id: userId, creator_name: creatorName, amount });

      if (error) throw error;

      alert(`Successfully tipped ${creatorName}!`);
    } catch (error) {
      console.error('Error sending tip:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  return { toggleLike, toggleFollow, sendTip, actionLoading };
}
