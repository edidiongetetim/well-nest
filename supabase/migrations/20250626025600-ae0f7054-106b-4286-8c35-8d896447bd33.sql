
-- Add new columns to posts table for enhanced functionality
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS mood TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS link_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS link_title TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS link_description TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS hashtags TEXT[];
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'anonymous', 'private'));
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS saves_count INTEGER DEFAULT 0;

-- Create reactions table for enhanced emoji reactions
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('relate', 'support', 'curious', 'inspired', 'like')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id, reaction_type)
);

-- Create saves table for bookmarking posts
CREATE TABLE IF NOT EXISTS public.post_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create follows table for user relationships
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hashtags table for trending topics
CREATE TABLE IF NOT EXISTS public.hashtags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create groups table for community groups
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_reactions
CREATE POLICY "Users can view all reactions" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can create their own reactions" ON public.post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON public.post_reactions FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for post_saves
CREATE POLICY "Users can view their own saves" ON public.post_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own saves" ON public.post_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saves" ON public.post_saves FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for user_follows
CREATE POLICY "Users can view all follows" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "Users can create their own follows" ON public.user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON public.user_follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS policies for post_comments
CREATE POLICY "Users can view all comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for hashtags and groups (public read access)
CREATE POLICY "Everyone can view hashtags" ON public.hashtags FOR SELECT USING (true);
CREATE POLICY "Everyone can view community groups" ON public.community_groups FOR SELECT USING (true);

-- Create triggers to update counts
CREATE OR REPLACE FUNCTION update_post_reactions_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- This function can be extended to update specific reaction counts if needed
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- This function can be extended to update specific reaction counts if needed
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts 
    SET saves_count = saves_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts 
    SET saves_count = saves_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_post_saves_count
  AFTER INSERT OR DELETE ON public.post_saves
  FOR EACH ROW EXECUTE FUNCTION update_post_saves_count();

CREATE TRIGGER trigger_update_post_comments_count
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Insert some sample hashtags and groups
INSERT INTO public.hashtags (tag, usage_count) VALUES 
  ('SingleParents', 15),
  ('FirstTrimesterTips', 23),
  ('PostpartumSupport', 18),
  ('PregnancyJourney', 31),
  ('NewMomLife', 27),
  ('MentalHealthMatters', 19)
ON CONFLICT (tag) DO NOTHING;

INSERT INTO public.community_groups (name, description, is_featured, member_count) VALUES 
  ('Single Parents Support', 'A supportive community for single parents navigating parenthood alone', true, 234),
  ('First Trimester Circle', 'Share experiences and tips for early pregnancy', true, 156),
  ('Postpartum Warriors', 'Support for mothers in their postpartum journey', true, 189),
  ('Working Moms Unite', 'Balancing career and motherhood together', true, 278),
  ('Teen Mom Support', 'A safe space for young mothers', false, 89),
  ('Rainbow Baby Families', 'Support for families after pregnancy loss', false, 67)
ON CONFLICT DO NOTHING;
